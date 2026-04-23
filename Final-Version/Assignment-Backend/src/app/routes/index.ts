import express from 'express';
import { AuditDataRoutes } from '../module/auditData/auditData.route.js';
import { CompanyRoutes } from '../module/company/company.route.js';
import { FinancialYearRoutes, YearRoutes } from '../module/financialYear/financialYear.route.js';
import { NotificationRoutes } from '../module/notification/notification.route.js';
import { UserRoutes } from '../module/user/user.route.js';

const router = express.Router();

const routes = [
  { path: '/users', route: UserRoutes },
  { path: '/companies', route: CompanyRoutes },
  { path: '/financial-years', route: YearRoutes },
  { path: '/financial-years', route: AuditDataRoutes },
  { path: '/notifications', route: NotificationRoutes },
];

routes.forEach(r => router.use(r.path, r.route));

// Nested: /companies/:companyId/financial-years
router.use('/companies/:companyId/financial-years', FinancialYearRoutes);

export const IndexRoutes = router;
