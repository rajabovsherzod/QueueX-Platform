import { Company as PrismaCompany } from "@prisma/client";
import { CompanyResponseDTO, CompanyDetailDTO } from "./superadmin.types";

export class CompanyDTO {
  public id: string;
  public name: string;
  public slug: string;
  public logo: string | null;
  public address: string | null;
  public phone: string | null;
  public email: string | null;
  public website: string | null;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(company: PrismaCompany) {
    this.id = company.id;
    this.name = company.name;
    this.slug = company.slug;
    this.logo = company.logo;
    this.address = company.description;
    this.phone = company.phone;
    this.email = company.email;
    this.website = company.website;
    this.status = company.isActive ? "ACTIVE" : "INACTIVE";
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
  }

  static toResponseDTO(company: PrismaCompany): CompanyResponseDTO {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      address: company.description,
      phone: company.phone,
      email: company.email,
      website: company.website,
      status: company.isActive ? "ACTIVE" : "INACTIVE",
    };
  }

  static toDetailDTO(company: PrismaCompany): CompanyDetailDTO {
    return {
      ...this.toResponseDTO(company),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  static toResponseDTOArray(companies: PrismaCompany[]): CompanyResponseDTO[] {
    return companies.map((company) => this.toResponseDTO(company));
  }
}
