import { Request, Response, NextFunction } from "express";
import asyncHandler from "@/shared/utils/async.handler";
import ApiError from "@/shared/utils/api.error";
import prisma from "@/shared/config/prisma.client";
import tokenService from "@/shared/services/token.service";

interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Ruxsat yo'q (token topilmadi)"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Ruxsat yo'q (token yaroqsiz)"));
    }

    const decoded = tokenService.verifyAccessToken(token) as JwtPayload;

    // Handle SUPER_ADMIN role separately (no database lookup needed)
    if (decoded.role === "SUPER_ADMIN") {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return next(
        new ApiError(
          401,
          "Ruxsat yo'q (foydalanuvchi topilmadi yoki aktiv emas)"
        )
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    };
    next();
  }
);

const requireSuperAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (req.user.role !== "SUPER_ADMIN") {
      return next(new ApiError(403, "Super Admin access required"));
    }

    next();
  }
);

export { requireSuperAdmin };
export default authMiddleware;
