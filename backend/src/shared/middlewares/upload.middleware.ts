import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiError from "@/shared/utils/api.error";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const createUploadDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Vaqtinchalik storage - slug hali noma'lum
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Vaqtinchalik folder - keyinchalik ko'chiramiz
    const uploadPath = path.join(process.cwd(), "uploads", "temp");
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `logo-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(400, "Faqat rasm fayllari ruxsat etilgan (JPEG, PNG, WebP)")
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

// Single logo upload middleware
export const uploadLogo: RequestHandler = upload.single("logo");

// Error handling wrapper
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(400, "Fayl hajmi 5MB dan oshmasligi kerak"));
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return next(new ApiError(400, "Faqat bitta fayl yuklash mumkin"));
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new ApiError(400, "Kutilmagan fayl maydoni"));
    }
  }
  next(error);
};

// File'ni to'g'ri joyga ko'chirish
export const moveLogoToCompanyFolder = (
  tempFilePath: string,
  companySlug: string,
  originalFilename: string
): string => {
  const normalizedSlug = companySlug.trim().toLowerCase();
  const ext = path.extname(originalFilename);
  
  const targetDir = path.join(
    process.cwd(),
    "uploads",
    "companies",
    normalizedSlug
  );
  
  createUploadDir(targetDir);
  
  const targetFilename = `logo${ext}`;
  const targetPath = path.join(targetDir, targetFilename);
  
  // Eski logo'ni o'chirish
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
    console.log(`🗑️ Deleted old logo: ${targetPath}`);
  }
  
  // Yangi logo'ni ko'chirish
  fs.renameSync(tempFilePath, targetPath);
  console.log(`📦 Moved logo: ${tempFilePath} -> ${targetPath}`);
  
  return `/uploads/companies/${normalizedSlug}/${targetFilename}`;
};

// Eski logo'ni o'chirish
export const deleteOldLogo = (companySlug: string): void => {
  const normalizedSlug = companySlug.toString().trim().toLowerCase();
  const logoDir = path.join(process.cwd(), "uploads", "companies", normalizedSlug);
  
  if (fs.existsSync(logoDir)) {
    const files = fs.readdirSync(logoDir);
    files.forEach((file) => {
      if (file.startsWith("logo")) {
        fs.unlinkSync(path.join(logoDir, file));
        console.log(`🗑️ Deleted old logo: ${file}`);
      }
    });
  }
};

// Logo URL generatsiya qilish
export const generateLogoUrl = (
  companySlug: string,
  filename: string
): string => {
  const normalizedSlug = companySlug.toString().trim().toLowerCase();
  return `/uploads/companies/${normalizedSlug}/${filename}`;
};

// Logo mavjudligini tekshirish
export const checkLogoExists = (companySlug: string): string | null => {
  const normalizedSlug = companySlug.toString().trim().toLowerCase();
  const logoDir = path.join(process.cwd(), "uploads", "companies", normalizedSlug);
  
  if (!fs.existsSync(logoDir)) {
    return null;
  }

  const files = fs.readdirSync(logoDir);
  const logoFile = files.find(file => file.startsWith("logo"));
  
  return logoFile ? generateLogoUrl(normalizedSlug, logoFile) : null;
};

// Vaqtinchalik file'ni o'chirish (xatolik yuz berganda)
export const cleanupTempFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🧹 Cleaned up temp file: ${filePath}`);
  }
};