import { Router } from "express";
import SuperAdminController from "./superadmin.controller";
import superAdminService from "./superadmin.service";
import { superAdminLoginSchema, createCompanySchema, updateCompanySchema, companyIdSchema} from "./superadmin.validator";
import validate from "@/shared/middlewares/validate.middleware";
import authMiddleware, {requireSuperAdmin} from "@/shared/middlewares/auth.middleware";
import { uploadLogo, handleUploadError } from "@/shared/middlewares/upload.middleware";

const router: Router = Router();
const superAdminController = new SuperAdminController(superAdminService);


router.post( "/login", validate(superAdminLoginSchema), superAdminController.login);

router.use(authMiddleware, requireSuperAdmin);
router.post("/companies", validate(createCompanySchema), uploadLogo, handleUploadError, superAdminController.createCompany);
router.get("/companies", superAdminController.getCompanies);
router.get("/companies/:id", validate(companyIdSchema), superAdminController.getCompany);
router.put("/companies/:id", validate(updateCompanySchema), validate(companyIdSchema), superAdminController.updateCompany);
router.patch("/companies/:id/toggle-status", validate(companyIdSchema), superAdminController.toggleCompanyStatus);
router.delete("/companies/:id", validate(companyIdSchema), superAdminController.deleteCompany);

export default router;
