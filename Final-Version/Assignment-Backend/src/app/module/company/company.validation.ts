import z from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
});

const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
});

const assignCompanySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const CompanyValidation = { createCompanySchema, updateCompanySchema, assignCompanySchema };
