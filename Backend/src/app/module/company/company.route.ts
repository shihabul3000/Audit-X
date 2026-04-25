import express from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { CompanyController } from './company.controller.js';
import { CompanyValidation } from './company.validation.js';

const router = express.Router();

router.get('/', checkAuth(), CompanyController.getCompanies);
router.post('/', checkAuth(), validateRequest(CompanyValidation.createCompanySchema), CompanyController.createCompany);
router.patch('/:id', checkAuth(), validateRequest(CompanyValidation.updateCompanySchema), CompanyController.updateCompany);
router.delete('/:id', checkAuth('ADMIN', 'SUPER_ADMIN'), CompanyController.deleteCompany);
router.post('/:id/assign', checkAuth('ADMIN', 'SUPER_ADMIN'), validateRequest(CompanyValidation.assignCompanySchema), CompanyController.assignCompany);
router.post('/:id/unassign', checkAuth('ADMIN', 'SUPER_ADMIN'), validateRequest(CompanyValidation.assignCompanySchema), CompanyController.unassignCompany);

export const CompanyRoutes = router;
