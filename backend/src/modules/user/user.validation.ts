import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "ADMIN", "SUPER_ADMIN"], {
    errorMap: () => ({ message: "Role must be STUDENT, ADMIN, or SUPER_ADMIN" }),
  }),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field (name or email) must be provided",
});

export const changeRoleSchema = z.object({
  role: z.enum(["STUDENT", "ADMIN", "SUPER_ADMIN"], {
    errorMap: () => ({ message: "Role must be STUDENT, ADMIN, or SUPER_ADMIN" }),
  }),
});

export const banSchema = z.object({
  reason: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});
