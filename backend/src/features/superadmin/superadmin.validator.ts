import { z } from "zod";

// Super Admin login schema
export const superAdminLoginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Email formati noto'g'ri")
      .min(1, "Email kiritish majburiy"),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, "Parol 100 ta belgidan oshmasligi kerak"),
  }),
});

export const createCompanySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Company nomi kiritish majburiy")
      .max(100, "Company nomi 100 ta belgidan oshmasligi kerak"),
    slug: z
      .string()
      .min(1, "Company slug kiritish majburiy")
      .max(50, "Company slug 50 ta belgidan oshmasligi kerak")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug faqat kichik harflar, raqamlar va tire bo'lishi kerak"
      ),
    address: z
      .string()
      .max(200, "Manzil 200 ta belgidan oshmasligi kerak")
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Telefon raqam formati noto'g'ri")
      .optional(),
    email: z.string().email("Email formati noto'g'ri").optional(),
    website: z.string().url("Website URL formati noto'g'ri").optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Company nomi kiritish majburiy")
      .max(100, "Company nomi 100 ta belgidan oshmasligi kerak")
      .optional(),
    slug: z
      .string()
      .min(1, "Company slug kiritish majburiy")
      .max(50, "Company slug 50 ta belgidan oshmasligi kerak")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug faqat kichik harflar, raqamlar va tire bo'lishi kerak"
      )
      .optional(),
    address: z
      .string()
      .max(200, "Manzil 200 ta belgidan oshmasligi kerak")
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Telefon raqam formati noto'g'ri")
      .optional(),
    email: z.string().email("Email formati noto'g'ri").optional(),
    website: z.string().url("Website URL formati noto'g'ri").optional(),
  }),
});


export const companyIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Company ID UUID formatida bo'lishi kerak"),
  }),
});
