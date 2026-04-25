import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["student", "admin", "super_admin"]).default("student"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["student", "admin", "super_admin"]).optional(),
  status: z.enum(["active", "banned", "deleted"]).optional(),
  bannedReason: z.string().optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(["student", "admin", "super_admin"]),
});

export const banUserSchema = z.object({
  reason: z.string().min(1, "Ban reason is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;