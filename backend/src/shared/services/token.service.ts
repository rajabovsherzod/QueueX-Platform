import jwt from "jsonwebtoken";
import ApiError from "@/shared/utils/api.error";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface PasswordResetPayload {
  userId: string;
  email: string;
}

class TokenService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "2h",
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "30d",
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as JwtPayload;
      return userData;
    } catch (error) {
      throw new ApiError(401, "Token yaroqsiz yoki muddati tugagan");
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as JwtPayload;
      return userData;
    } catch (error) {
      throw new ApiError(401, "Refresh token yaroqsiz yoki muddati tugagan");
    }
  }

  generateTokenPair(payload: JwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  generatePasswordResetToken(payload: PasswordResetPayload): string {
    return jwt.sign(payload, process.env.JWT_RESET_SECRET!, {
      expiresIn: "10m", // 10 daqiqa
    });
  }

  verifyPasswordResetToken(token: string): PasswordResetPayload {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_RESET_SECRET!
      ) as PasswordResetPayload;
      return userData;
    } catch (error) {
      throw new ApiError(401, "Reset token yaroqsiz yoki muddati tugagan");
    }
  }
}

export default new TokenService();
