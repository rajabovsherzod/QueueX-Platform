import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import ApiError from "@/shared/utils/api.error";

export const validateFormData = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // FormData multer tomonidan parse qilingan
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new ApiError(400, "Validation failed", errors);
      }
      
      // Validatsiya muvaffaqiyatli
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};