import express from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { UserController } from './user.controller.js';
import { UserValidation } from './user.validation.js';

const router = express.Router();

router.get('/me', checkAuth(), UserController.getMe);
router.get('/', checkAuth('SUPER_ADMIN'), UserController.getAllUsers);
router.get('/:id', checkAuth('ADMIN', 'SUPER_ADMIN'), UserController.getUserById);
router.patch('/:id', checkAuth('ADMIN', 'SUPER_ADMIN'), validateRequest(UserValidation.updateUserSchema), UserController.updateUser);
router.delete('/:id', checkAuth('SUPER_ADMIN'), UserController.softDeleteUser);
router.post('/create-admin', checkAuth('SUPER_ADMIN'), validateRequest(UserValidation.createAdminSchema), UserController.createAdmin);
router.post('/create-super-admin', checkAuth('SUPER_ADMIN'), validateRequest(UserValidation.createAdminSchema), UserController.createSuperAdmin);

export const UserRoutes = router;
