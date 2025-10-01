import { z } from "zod";

// Register schema
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Email formati noto'g'ri")
      .min(1, "Email kiritish majburiy"),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, "Parol 100 ta belgidan oshmasligi kerak"),
    firstName: z
      .string()
      .min(1, "Ism kiritish majburiy")
      .max(50, "Ism 50 ta belgidan oshmasligi kerak"),
    lastName: z
      .string()
      .min(1, "Familiya kiritish majburiy")
      .max(50, "Familiya 50 ta belgidan oshmasligi kerak"),
    phone: z
      .string()
      .min(9, "Telefon raqam kamida 9 ta raqamdan iborat bo'lishi kerak")
      .max(15, "Telefon raqam 15 ta raqamdan oshmasligi kerak")
      .regex(/^\+?[1-9]\d{1,14}$/, "Telefon raqam formati noto'g'ri")
      .optional(),
  }),
});

// Login schema
export const loginSchema = z.object({
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

// Verify email schema
export const verifyEmailSchema = z.object({
  body: z.object({
    userId: z.string().uuid("User ID UUID formatida bo'lishi kerak"),
    code: z
      .string()
      .min(6, "Tasdiqlash kodi 6 ta raqamdan iborat bo'lishi kerak")
      .max(6, "Tasdiqlash kodi 6 ta raqamdan iborat bo'lishi kerak")
      .regex(
        /^\d{6}$/,
        "Tasdiqlash kodi faqat raqamlardan iborat bo'lishi kerak"
      ),
  }),
});

// Change password schema
export const changePasswordSchema = z
  .object({
    body: z.object({
      currentPassword: z.string().min(1, "Joriy parol kiritish majburiy"),
      newPassword: z
        .string()
        .min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak")
        .max(100, "Yangi parol 100 ta belgidan oshmasligi kerak"),
      confirmPassword: z.string().min(1, "Parolni tasdiqlash majburiy"),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmPassword, {
    message: "Yangi parol va tasdiqlash parollari mos kelmaydi",
    path: ["body", "confirmPassword"],
  });

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Email formati noto'g'ri")
      .min(1, "Email kiritish majburiy"),
  }),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token kiritish majburiy"),
    newPassword: z
      .string()
      .min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, "Yangi parol 100 ta belgidan oshmasligi kerak"),
  }),
});
