import prisma from "@/shared/config/prisma.client";
import bcrypt from "bcryptjs";
import ApiError from "@/shared/utils/api.error";
import tokenService from "@/shared/services/token.service";
import emailService from "@/shared/services/email.service";
import { generateOTP } from "@/shared/utils/crypto.utils";
import {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./auth.types";

export class AuthService {
  public async register(data: RegisterRequest) {
    const { email, password, firstName, lastName, phone } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, "Bu email allaqachon ro'yxatdan o'tgan");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: "CUSTOMER",
        status: "PENDING",
      },
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 daqiqa

    await prisma.verificationCode.deleteMany({
      where: { userId: user.id },
    });

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: otp,
        expiresAt,
      },
    });

    await emailService.sendVerificationEmail(email, otp, firstName);

    return {
      message:
        "Ro'yxatdan o'tish muvaffaqiyatli! Emailingizga yuborilgan kodni tasdiqlang.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  public async verifyEmail(userId: string, code: string) {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationCode) {
      throw new ApiError(400, "Noto'g'ri yoki muddati tugagan kod");
    }

    const user = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
      });

      await tx.verificationCode.delete({
        where: { id: verificationCode.id },
      });

      return updatedUser;
    });

    const tokens = tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      tokens,
    };
  }

  public async login(data: LoginRequest) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, "Email yoki parol noto'g'ri");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(
        401,
        "Hisobingiz faollashtirilmagan. Emailni tasdiqlang."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Email yoki parol noto'g'ri");
    }

    const tokens = tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      tokens,
    };
  }

  public async refreshToken(refreshToken: string) {
    const payload = tokenService.verifyRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken, userId: payload.userId },
      include: { user: true },
    });

    if (!storedToken) {
      throw new ApiError(401, "Noto'g'ri refresh token");
    }

    if (storedToken.user.status !== "ACTIVE") {
      throw new ApiError(401, "Hisobingiz faollashtirilmagan");
    }

    const newTokens = tokenService.generateTokenPair({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        token: newTokens.refreshToken,
      },
    });

    return newTokens;
  }

  public async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "Foydalanuvchi topilmadi");
    }

    return user;
  }

  public async changePassword(userId: string, data: ChangePasswordRequest) {
    const { currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "Foydalanuvchi topilmadi");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new ApiError(400, "Joriy parol noto'g'ri");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: "Parol muvaffaqiyatli o'zgartirildi" };
  }

  public async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: "Muvaffaqiyatli chiqildi" };
  }

  public async logoutAll(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: "Barcha qurilmalardan chiqildi" };
  }

  public async forgotPassword(data: ForgotPasswordRequest) {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: "Agar email mavjud bo'lsa, parolni tiklash linki yuborildi",
      };
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(400, "Hisobingiz faollashtirilmagan");
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const resetToken = tokenService.generatePasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    await emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: "Agar email mavjud bo'lsa, parolni tiklash linki yuborildi",
    };
  }

  public async resetPassword(data: ResetPasswordRequest) {
    const { token, newPassword } = data;
    let payload;
    try {
      payload = tokenService.verifyPasswordResetToken(token);
    } catch (error) {
      throw new ApiError(400, "Noto'g'ri yoki muddati tugagan token");
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        userId: payload.userId,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      throw new ApiError(400, "Noto'g'ri yoki muddati tugagan token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
      prisma.refreshToken.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    return { message: "Parol muvaffaqiyatli yangilandi" };
  }
}

export default new AuthService();
