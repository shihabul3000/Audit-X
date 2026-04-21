import { Router } from "express";
import * as companyController from "./company.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import {
  createCompanySchema,
  updateCompanySchema,
  assignSchema,
} from "./company.validation";
import yearRoutes from "../financial-year/financialYear.routes";

const router = Router();

router.use("/:cId/years", yearRoutes);

router.get(
  "/",
  authenticate,
  companyController.getAll
);

router.get(
  "/:id",
  authenticate,
  companyController.getById
);

router.post(
  "/",
  authenticate,
  validate(createCompanySchema),
  companyController.create
);

router.patch(
  "/:id",
  authenticate,
  validate(updateCompanySchema),
  companyController.update
);

router.delete(
  "/:id",
  authenticate,
  companyController.softDelete
);

router.post(
  "/:id/assign",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(assignSchema),
  companyController.assign
);

router.post(
  "/:id/unassign",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(assignSchema),
  companyController.unassign
);

router.get(
  "/:id/members",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  companyController.getMembers
);

export default router;