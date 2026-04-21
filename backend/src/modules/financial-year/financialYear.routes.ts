import { Router } from "express";
import * as financialYearController from "./financialYear.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createYearSchema,
  updateYearSchema,
  rolloverSchema,
} from "./financialYear.validation";

const router = Router();

router.get(
  "/",
  authenticate,
  financialYearController.getAll
);

router.get(
  "/:yId",
  authenticate,
  financialYearController.getById
);

router.post(
  "/",
  authenticate,
  validate(createYearSchema),
  financialYearController.create
);

router.patch(
  "/:yId",
  authenticate,
  validate(updateYearSchema),
  financialYearController.update
);

router.delete(
  "/:yId",
  authenticate,
  financialYearController.remove
);

router.post(
  "/:yId/rollover",
  authenticate,
  validate(rolloverSchema),
  financialYearController.rollover
);

export default router;