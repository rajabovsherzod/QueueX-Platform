import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/async.handler";
import ApiResponse from "@/shared/utils/api.response";
import { CompanyService } from "./company.service";
import { CreateBranchRequest, UpdateBranchRequest } from "./company.types";
import { TenantMiddleware } from "@/shared/middlewares/tenant.middleware";
import ApiError from "@/shared/utils/api.error";

class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  public createBranch = asyncHandler(async (req: Request, res: Response) => {
    const { name, address, phone, email, workingHours } = req.body as CreateBranchRequest;
    const tenantDb = await TenantMiddleware.getTenantDatabase(req);

    const result = await this.companyService.createBranch(tenantDb, { name, address, phone, email, workingHours });

    return res
      .status(201)
      .json(new ApiResponse(result, "Branch created successfully"));
  });

  public updateBranch = asyncHandler(async (req: Request, res: Response) => {
    const { branchId } = req.params;
    if (!branchId) {
      throw new ApiError(400, "Branch ID is required");
    }

    const { name, address, phone, email, workingHours, isActive } = req.body as UpdateBranchRequest;
    const tenantDb = await TenantMiddleware.getTenantDatabase(req);

    const result = await this.companyService.updateBranch(tenantDb, branchId, { name, address, phone, email, workingHours, isActive });

    return res
      .status(200)
      .json(new ApiResponse(result, "Branch updated successfully"));
  });

  public getAllBranches = asyncHandler(async (req: Request, res: Response) => {
    const tenantDb = await TenantMiddleware.getTenantDatabase(req);
    const result = await this.companyService.getAllBranches(tenantDb);

    return res
      .status(200)
      .json(new ApiResponse(result, "Branches retrieved successfully"));
  });

  public getBranchById = asyncHandler(async (req: Request, res: Response) => {
    const { branchId } = req.params;
    if (!branchId) {
      throw new ApiError(400, "Branch ID is required");
    }

    const tenantDb = await TenantMiddleware.getTenantDatabase(req);
    const result = await this.companyService.getBranchById(tenantDb, branchId);

    return res
      .status(200)
      .json(new ApiResponse(result, "Branch retrieved successfully"));
  });

  public deleteBranch = asyncHandler(async (req: Request, res: Response) => {
    const { branchId } = req.params;
    if (!branchId) {
      throw new ApiError(400, "Branch ID is required");
    }

    const tenantDb = await TenantMiddleware.getTenantDatabase(req);
    await this.companyService.deleteBranch(tenantDb, branchId);

    return res
      .status(200)
      .json(new ApiResponse(null, "Branch deleted successfully"));
  });
}

export default new CompanyController(new CompanyService());
