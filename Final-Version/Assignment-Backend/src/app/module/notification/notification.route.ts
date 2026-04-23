import express from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { NotificationController } from './notification.controller.js';

const router = express.Router();

router.get('/', checkAuth(), NotificationController.getNotifications);
router.patch('/:id/read', checkAuth(), NotificationController.markRead);
router.patch('/read-all', checkAuth(), NotificationController.markAllRead);

export const NotificationRoutes = router;
