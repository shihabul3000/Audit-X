import z from 'zod';

const createFinancialYearSchema = z.object({
  reportingDate: z.string().min(1, 'Reporting date is required'),
});

const assignFinancialYearSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const FinancialYearValidation = {
  createFinancialYearSchema,
  assignFinancialYearSchema,
};
