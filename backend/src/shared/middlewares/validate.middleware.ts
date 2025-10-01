import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import ApiError from "@/shared/utils/api.error";

const validate =
  (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join("."),
        }));
        return next(
          new ApiError(400, "Kiritilgan ma'lumotlar noto'g'ri", errorMessages)
        );
      }
      next(error);
    }
  };

export default validate;
