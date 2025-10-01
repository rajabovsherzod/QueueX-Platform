import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiError from "@/shared/utils/api.error";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;

const createUploadDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Company ID, slug yoki companyId'dan birini olish
    const companyIdentifier = req.params.id || req.body.slug || req.body.companyId;
    
    if (!companyIdentifier) {
      return cb(new ApiError(400, "Company identifier (ID or slug) required for file upload"), "");
    }

    // Slug'ni normalize qilish (kichik harf, trim)
    const normalizedIdentifier = companyIdentifier.toString().trim().toLowerCase();

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "companies",
      normalizedIdentifier  // Slug yoki ID ishlatish
    );
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `logo${ext}`;
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

// Eski logo'ni o'chirish (slug bilan)
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

// Logo URL generatsiya qilish (slug bilan)
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