import z from 'zod';

const createAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['STUDENT', 'ADMIN', 'SUPER_ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'BLOCKED', 'DELETED']).optional(),
});

export const UserValidation = {
  createAdminSchema,
  updateUserSchema,
};
