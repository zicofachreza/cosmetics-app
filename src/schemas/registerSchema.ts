import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required"),

  username: z
    .string()
    .min(1, "Username is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(5, "Password must be at least 5 characters"),

  agreeTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to Terms of Service and Privacy Policy",
    }),
});

export type RegisterForm = z.infer<typeof registerSchema>;