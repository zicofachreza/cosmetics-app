import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Alamat email wajib diisi")
    .email("Alamat email tidak valid"),

  password: z
    .string()
    .min(1, "Kata sandi wajib diisi")
    .min(5, "Kata sandi harus terdiri minimal 5 karakter"),
});

export type LoginForm = z.infer<typeof loginSchema>;