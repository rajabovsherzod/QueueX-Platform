import prisma from "@/shared/config/prisma.client";
import bcrypt from "bcryptjs";
import ApiError from "@/shared/utils/api.error";
import tokenService from "@/shared/services/token.service";
import databaseService from "@/shared/services/database.service";
import { SuperAdminLoginResponse, CreateCompanyRequest, CompanyResponseDTO, CompanyDetailDTO } from "./superadmin.types";
import { CompanyDTO } from "./superadmin.dto";

export class SuperAdminService {
  public async login(email: string, password: string): Promise<SuperAdminLoginResponse> {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      throw new ApiError(500, "Super admin credentials not configured");
    }

    if (email !== superAdminEmail) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, superAdminPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = tokenService.generateAccessToken({
      userId: "super-admin",
      email: superAdminEmail,
      role: "SUPER_ADMIN",
    });

    return {
      accessToken,
      user: {
        email: superAdminEmail,
        role: "SUPER_ADMIN",
      },
    };
  }

  public async createCompany(data: CreateCompanyRequest, logoFile?: Express.Multer.File): Promise<CompanyResponseDTO> {
    const { name, slug, address, phone, email, website } = data;
  
    if (!name?.trim()) {
      throw new ApiError(400, "Company name is required");
    }
  
    if (!slug?.trim()) {
      throw new ApiError(400, "Company slug is required");
    }
  
    const existingCompany = await prisma.company.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });
  
    if (existingCompany) {
      throw new ApiError(400, "Company slug already exists");
    }
  
    try {
      // 1. Database yaratish
      const dbConfig = await databaseService.createCompanyDatabase(
        slug.trim().toLowerCase()
      );
  
      // 2. Logo path tayyorlash
      let logoPath: string | null = null;
      if (logoFile) {
        // Middleware allaqachon file'ni to'g'ri joyga saqlagan
        // Faqat URL path yaratish kerak
        const normalizedSlug = slug.trim().toLowerCase();
        logoPath = `/uploads/companies/${normalizedSlug}/${logoFile.filename}`;
        
        console.log(`📁 Logo file saved to: ${logoFile.path}`);
        console.log(`🔗 Logo URL: ${logoPath}`);
      }
  
      // 3. Company yaratish
      const company = await prisma.company.create({
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: address?.trim() || null,
          logo: logoPath, // Logo URL path saqlash
          phone: phone?.trim() || null,
          email: email?.trim() || null,
          website: website?.trim() || null,
          isActive: false,
          dbHost: dbConfig.host,
          dbName: dbConfig.database,
          dbUser: dbConfig.username,
          dbPassword: dbConfig.password,
        },
      });
  
      console.log(`✅ Company created: ${company.name} (${company.slug})`);
      console.log(`✅ Database created: ${dbConfig.database}`);
      
      if (logoFile) {
        console.log(`✅ Logo uploaded: ${logoFile.originalname} -> ${logoFile.filename}`);
        console.log(`✅ Logo accessible at: ${logoPath}`);
      }
  
      return CompanyDTO.toResponseDTO(company);
      
    } catch (error: any) {
      // Xatolik bo'lsa, cleanup
      console.error(`❌ Company creation failed: ${error.message}`);
      
      try {
        await databaseService.deleteCompanyDatabase(slug.trim().toLowerCase());
        console.log(`🧹 Database cleanup completed for: ${slug}`);
      } catch (cleanupError) {
        console.error("❌ Database cleanup failed:", cleanupError);
      }
  
      // Logo file'ni ham o'chirish (agar yuklangan bo'lsa)
      if (logoFile && logoFile.path) {
        try {
          const fs = require('fs');
          if (fs.existsSync(logoFile.path)) {
            fs.unlinkSync(logoFile.path);
            console.log(`🧹 Logo file cleanup completed: ${logoFile.path}`);
          }
        } catch (logoCleanupError) {
          console.error("❌ Logo file cleanup failed:", logoCleanupError);
        }
      }
  
      throw new ApiError(500, `Company creation failed: ${error.message}`);
    }
  }

  public async getAllCompanies(): Promise<CompanyResponseDTO[]> {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    });

    return CompanyDTO.toResponseDTOArray(companies);
  }

  public async getCompanyById(id: string): Promise<CompanyDetailDTO> {
    if (!id?.trim()) {
      throw new ApiError(400, "Company ID is required");
    }

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    return CompanyDTO.toDetailDTO(company);
  }

  public async updateCompany(
    id: string,
    data: Partial<CreateCompanyRequest>
  ): Promise<CompanyDetailDTO> {
    if (!id?.trim()) {
      throw new ApiError(400, "Company ID is required");
    }

    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new ApiError(404, "Company not found");
    }

    if (data.slug && data.slug.trim() !== existingCompany.slug) {
      const slugExists = await prisma.company.findUnique({
        where: { slug: data.slug.trim().toLowerCase() },
      });

      if (slugExists) {
        throw new ApiError(400, "Company slug already exists");
      }
    }

    const updateData: any = {};
    if (data.name !== undefined)
      updateData.name = data.name?.trim() || existingCompany.name;
    if (data.slug !== undefined)
      updateData.slug = data.slug?.trim().toLowerCase() || existingCompany.slug;
    if (data.address !== undefined)
      updateData.description = data.address?.trim() || null;
    if (data.logo !== undefined) updateData.logo = data.logo?.trim() || null;
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() || null;
    if (data.email !== undefined) updateData.email = data.email?.trim() || null;
    if (data.website !== undefined)
      updateData.website = data.website?.trim() || null;

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return CompanyDTO.toDetailDTO(updatedCompany);
  }

  public async toggleCompanyStatus(
    id: string
  ): Promise<{ message: string; status: string }> {
    if (!id?.trim()) {
      throw new ApiError(400, "Company ID is required");
    }

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { isActive: !company.isActive },
    });

    return {
      message: `Company ${
        updatedCompany.isActive ? "activated" : "deactivated"
      } successfully`,
      status: updatedCompany.isActive ? "ACTIVE" : "INACTIVE",
    };
  }

  public async deleteCompany(id: string): Promise<{ message: string }> {
    if (!id?.trim()) {
      throw new ApiError(400, "Company ID is required");
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
        branches: true,
        services: true,
        queues: true,
      },
    });

    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    if (
      company.users.length > 0 ||
      company.branches.length > 0 ||
      company.services.length > 0 ||
      company.queues.length > 0
    ) {
      throw new ApiError(
        400,
        "Cannot delete company with existing users, branches, services, or queues"
      );
    }

    await prisma.company.delete({
      where: { id },
    });

    return { message: "Company deleted successfully" };
  }
}

export default new SuperAdminService();
