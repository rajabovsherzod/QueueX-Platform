import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/async.handler";
import { AuthService } from "@/features/auth/auth.service";
import {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./auth.types";
import ApiResponse from "@/shared/utils/api.response";
import ApiError from "@/shared/utils/api.error";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = asyncHandler(
    async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
      const { email, password, firstName, lastName, phone } = req.body;

      const result = await this.authService.register({email, password, firstName, lastName, phone});

      res.status(201).json(new ApiResponse(result, result.message));
    }
  );

  public login = asyncHandler(
    async (req: Request<{}, {}, LoginRequest>, res: Response) => {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const response = {
        user: result.user,
        accessToken: result.tokens.accessToken,
      };

      res
        .status(200)
        .json(new ApiResponse(response, "User logged in successfully"));
    }
  );

  public verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.body;
    const result = await this.authService.verifyEmail(userId, code);

    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    res
      .status(200)
      .json(new ApiResponse({ user: result.user, accessToken: result.tokens.accessToken }, "Email verified successfully"));
  });

  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }
    const user = await this.authService.getProfile(userId);
    res
      .status(200)
      .json(new ApiResponse(user, "Profile retrieved successfully"));
  });

  public changePassword = asyncHandler(
    async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }
      const { currentPassword, newPassword } = req.body;
      const result = await this.authService.changePassword(userId, {
        currentPassword,
        newPassword,
      });
      res
        .status(200)
        .json(new ApiResponse(result, "Password changed successfully"));
    }
  );

  public forgotPassword = asyncHandler(
    async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
      const { email } = req.body;
      const result = await this.authService.forgotPassword({ email });
      res
        .status(200)
        .json(new ApiResponse(result, "Password reset email sent"));
    }
  );

  public resetPassword = asyncHandler(
    async (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => {
      const { token, newPassword } = req.body;
      const result = await this.authService.resetPassword({
        token,
        newPassword,
      });
      res
        .status(200)
        .json(new ApiResponse(result, "Password reset successfully"));
    }
  );

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not found");
    }
    const tokens = await this.authService.refreshToken(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          { accessToken: tokens.accessToken },
          "Token refreshed successfully"
        )
      );
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not found");
    }
    const result = await this.authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    res.status(200).json(new ApiResponse(result, "Logged out successfully"));
  });

  public logoutAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }
    const result = await this.authService.logoutAll(userId);
    res
      .status(200)
      .json(new ApiResponse(result, "Logged out from all devices"));
  });
}

export default AuthController;
