import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.client";
import ApiError from "../utils/api.error";
import databaseService from "../services/database.service";

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        slug: string;
        name: string;
        dbName: string | null;
        isActive: boolean;
      };
    }
  }
}

export class TenantMiddleware {
  public static extractTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantSlug = (req.headers["x-subdomain"] || req.query.tenant) as string;

      if (!tenantSlug) {
        return next();
      }

      const company = await prisma.company.findFirst({
        where: {
          slug: tenantSlug,
          isActive: true,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          dbName: true,
          isActive: true,
        },
      });

      if (!company) {
        throw new ApiError(
          404,
          `Company '${tenantSlug}' topilmadi yoki faol emas`
        );
      }

      req.tenant = company;
      next();
    } catch (error) {
      next(error);
    }
  };

  public static requireTenant = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.tenant) {
      throw new ApiError(400, "Tenant konteksti majburiy");
    }
    next();
  };

  public static getTenantDatabase = async (req: Request) => {
    if (!req.tenant) {
      throw new ApiError(400, "Tenant konteksti topilmadi");
    }

    return await databaseService.getCompanyConnection(req.tenant.id);
  };
}

export const getTenantDb = async (req: Request) => {
  return await TenantMiddleware.getTenantDatabase(req);
};
