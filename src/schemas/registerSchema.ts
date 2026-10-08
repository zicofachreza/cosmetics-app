import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi"),

  email: z
    .string()
    .min(1, "Alamat email wajib diisi")
    .email("Alamat email tidak valid"),

  password: z
    .string()
    .min(1, "Kata sandi wajib diisi")
    .min(5, "Kata sandi harus terdiri minimal 5 karakter"),

  agreeTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi",
    }),
});

export type RegisterForm = z.infer<typeof registerSchema>;