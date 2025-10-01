import { z } from "zod";

// Zod validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Elektron pochta manzili kiritilishi shart")
    .email("Noto'g'ri elektron pochta formati"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    .max(50, "Parol 50 ta belgidan oshmasligi kerak"),
  rememberMe: z.boolean().optional(),
});

// Type inference from schema
export type LoginFormData = z.infer<typeof loginSchema>;
