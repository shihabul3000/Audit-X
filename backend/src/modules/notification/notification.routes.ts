import { Router } from "express";
import * as notificationController from "./notification.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", notificationController.getAll);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);

export default router;
