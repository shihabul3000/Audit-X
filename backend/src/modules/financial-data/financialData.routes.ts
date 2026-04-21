import { Router } from "express";
import * as financialDataController from "./financialData.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/:yearId",
  authenticate,
  financialDataController.getFullData
);

router.patch(
  "/:yearId/audit-report-data",
  authenticate,
  financialDataController.updateAuditReportData
);

router.patch(
  "/:yearId/notes-data",
  authenticate,
  financialDataController.updateNotesData
);

router.patch(
  "/:yearId/discussion-data",
  authenticate,
  financialDataController.updateDiscussionData
);

export default router;