import { z } from "zod";

export const createYearSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  year: z.string().min(1, "Year is required"),
  reportingDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
});

export const updateYearSchema = z.object({
  year: z.string().min(1, "Year is required").optional(),
  reportingDate: z.string().datetime().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
});

export const submitYearSchema = z.object({
  notes: z.string().optional(),
});

export const reviewYearSchema = z.object({
  action: z.enum(["approve", "request_changes", "reject"]),
  comment: z.string().optional(),
});

export const finalizeYearSchema = z.object({
  comment: z.string().optional(),
});

export const assignUsersSchema = z.object({
  studentIds: z.array(z.string()).optional(),
  adminIds: z.array(z.string()).optional(),
});

export type CreateYearInput = z.infer<typeof createYearSchema>;
export type UpdateYearInput = z.infer<typeof updateYearSchema>;
export type SubmitYearInput = z.infer<typeof submitYearSchema>;
export type ReviewYearInput = z.infer<typeof reviewYearSchema>;
export type FinalizeYearInput = z.infer<typeof finalizeYearSchema>;
export type AssignUsersInput = z.infer<typeof assignUsersSchema>;