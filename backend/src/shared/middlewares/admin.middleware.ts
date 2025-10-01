import { Request, Response, NextFunction } from "express";
import asyncHandler from "@/shared/utils/async.handler";
import ApiError from "@/shared/utils/api.error";
import { UserRole } from "@prisma/client";

const adminMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== UserRole.SUPER_ADMIN) {
      return next(new ApiError(403, "Ruxsat yo'q (faqat adminlar uchun)"));
    }
    next();
  }
);

export default adminMiddleware;
