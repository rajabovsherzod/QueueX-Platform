import { Router } from "express";
import authRoutes from "@/features/auth/auth.routes";
import superAdminRoutes from "@/features/superadmin/superadmin.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/superadmin", superAdminRoutes);

export default router;