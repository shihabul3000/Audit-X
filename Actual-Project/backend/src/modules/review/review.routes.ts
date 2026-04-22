import { Router } from "express";
import * as reviewController from "./review.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/:yearId/submit",
  authenticate,
  reviewController.submit
);

router.post(
  "/:yearId/start-review",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.startReview
);

router.post(
  "/:yearId/request-changes",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.requestChanges
);

router.post(
  "/:yearId/finalize",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.finalize
);

router.post(
  "/:yearId/reopen",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.reopen
);

router.get(
  "/queue",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  reviewController.getQueue
);

router.get(
  "/:yearId/events",
  authenticate,
  reviewController.getEvents
);

export default router;