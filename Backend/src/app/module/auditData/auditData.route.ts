import express from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { AuditDataController } from './auditData.controller.js';

const router = express.Router();

router.get('/:yearId/data', checkAuth(), AuditDataController.getYearData);
router.put('/:yearId/audit-data', checkAuth(), AuditDataController.saveAuditData);
router.put('/:yearId/notes-data', checkAuth(), AuditDataController.saveNotesData);

export const AuditDataRoutes = router;
