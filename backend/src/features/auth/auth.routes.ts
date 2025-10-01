import { Router } from "express";
import validate from "@/shared/middlewares/validate.middleware";
import authMiddleware from "@/shared/middlewares/auth.middleware";
import AuthController from "@/features/auth/auth.controller";
import authService from "@/features/auth/auth.service";
import { registerSchema, loginSchema, verifyEmailSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validators";

const authController = new AuthController(authService);
const router: Router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

router.post("/refresh-token", authController.refreshToken);
router.get("/get-profile", authMiddleware, authController.getProfile);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), authController.changePassword);
router.post("/logout", authController.logout);
router.post("/logout-all", authMiddleware, authController.logoutAll);

export default router;
