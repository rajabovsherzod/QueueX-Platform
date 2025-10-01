import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Kompaniya nomi kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Kompaniya nomi 100 ta belgidan oshmasligi kerak"),

  slug: z
    .string()
    .min(2, "Slug kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(50, "Slug 50 ta belgidan oshmasligi kerak")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug faqat kichik harflar, raqamlar va tire (-) dan iborat bo'lishi kerak"
    ),

  logo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Logo fayli 5MB dan kichik bo'lishi kerak"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Logo faqat JPG, PNG yoki WebP formatida bo'lishi kerak"
    )
    .optional(),

  address: z
    .string()
    .min(5, "Manzil kamida 5 ta belgidan iborat bo'lishi kerak")
    .max(200, "Manzil 200 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal(""))
    .nullable(),

  phone: z
    .string()
    .regex(
      /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
      "Telefon raqami +998 XX XXX XX XX formatida bo'lishi kerak"
    )
    .optional()
    .or(z.literal(""))
    .nullable(),

  email: z
    .string()
    .email("To'g'ri email manzil kiriting")
    .optional()
    .or(z.literal(""))
    .nullable(),

  website: z
    .string()
    .url("To'g'ri website URL kiriting")
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
