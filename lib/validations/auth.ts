import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  next: z.string().optional(),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
});
