import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),

  email: z.string().email("Invalid email format").max(100, "Email too long"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),

  personalDetails: z.record(z.string(), z.any()).optional().default({}),
});

export const loginUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .optional(),
  email: z.string().email("Invalid email format"),

  password: z.string().min(1, "Password is required"),
});

export default {
  registerUser: registerUserSchema,
  loginUser: loginUserSchema,
};
