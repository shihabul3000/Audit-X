import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").optional(),
  address: z.string().optional(),
});

export const addUserToCompanySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.string().min(1, "Role is required").default("member"),
});

export const removeUserFromCompanySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type AddUserToCompanyInput = z.infer<typeof addUserToCompanySchema>;
export type RemoveUserFromCompanyInput = z.infer<typeof removeUserFromCompanySchema>;