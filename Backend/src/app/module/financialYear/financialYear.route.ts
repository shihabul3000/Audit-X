import express from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { FinancialYearController } from './financialYear.controller.js';
import { FinancialYearValidation } from './financialYear.validation.js';

const router = express.Router({ mergeParams: true });

// Under /api/v1/companies/:companyId/financial-years
router.get('/', checkAuth(), FinancialYearController.getFinancialYears);
router.post('/', checkAuth(), validateRequest(FinancialYearValidation.createFinancialYearSchema), FinancialYearController.createFinancialYear);

export const FinancialYearRoutes = router;

// Standalone year routes under /api/v1/financial-years
const yearRouter = express.Router();

yearRouter.delete('/:yearId', checkAuth(), FinancialYearController.deleteFinancialYear);
yearRouter.post('/:yearId/assign', checkAuth('ADMIN', 'SUPER_ADMIN'), validateRequest(FinancialYearValidation.assignFinancialYearSchema), FinancialYearController.assignFinancialYear);
yearRouter.post('/:yearId/submit', checkAuth(), FinancialYearController.submitYear);
yearRouter.post('/:yearId/review-actions', checkAuth('ADMIN', 'SUPER_ADMIN'), FinancialYearController.reviewAction);

export const YearRoutes = yearRouter;
