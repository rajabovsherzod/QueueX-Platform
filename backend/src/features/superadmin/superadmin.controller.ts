import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/async.handler";
import { SuperAdminService } from "./superadmin.service";
import { SuperAdminLoginRequest, CreateCompanyRequest } from "./superadmin.types";
import ApiResponse from "@/shared/utils/api.response";
import ApiError from "@/shared/utils/api.error";

class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  public login = asyncHandler(
    async (req: Request<{}, {}, SuperAdminLoginRequest>, res: Response) => {
      const { email, password } = req.body;
      const result = await this.superAdminService.login(email, password);
      res
        .status(200)
        .json(new ApiResponse(result, "Super admin login successful"));
    }
  );

  public createCompany = asyncHandler(
    async (req: Request<{}, {}, CreateCompanyRequest>, res: Response) => {
      const logoFile = req.file;
      const companyData = req.body;
  
      const company = await this.superAdminService.createCompany(
        companyData,
        logoFile 
      );
      
      res
        .status(201)
        .json(new ApiResponse(company, "Company created successfully"));
    }
  );

  public getCompanies = asyncHandler(async (req: Request, res: Response) => {
    const companies = await this.superAdminService.getAllCompanies();
    res
      .status(200)
      .json(new ApiResponse(companies, "Companies retrieved successfully"));
  });

  public getCompany = asyncHandler(async (req: Request, res: Response) => {
    const company = await this.superAdminService.getCompanyById(req.params.id!);
    res
      .status(200)
      .json(new ApiResponse(company, "Company retrieved successfully"));
  });

  public updateCompany = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateData = req.body;

      const company = await this.superAdminService.updateCompany(id!, updateData);

      res.status(200).json({
        status: "success",
        message: "Company muvaffaqiyatli yangilandi",
        data: { company },
      });
    }
  );

  public toggleCompanyStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await this.superAdminService.toggleCompanyStatus(
        req.params.id!
      );
      res.status(200).json(new ApiResponse(result, result.message));
    }
  );

  public deleteCompany = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.superAdminService.deleteCompany(req.params.id!);
    res.status(200).json(new ApiResponse(result, result.message));
  });
}

export default SuperAdminController;
