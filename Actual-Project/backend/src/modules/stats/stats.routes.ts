import { Router } from "express";
import * as statsController from "./stats.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

router.use(authenticate);

// Super Admins see everything
router.get("/system", authorize("SUPER_ADMIN"), statsController.getSystemStats);

// Admins see their specific overview
router.get("/admin", authorize("ADMIN", "SUPER_ADMIN"), statsController.getAdminStats);

export default router;
