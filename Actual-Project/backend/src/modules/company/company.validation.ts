import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  address: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field (name or address) must be provided",
});

export const assignSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});