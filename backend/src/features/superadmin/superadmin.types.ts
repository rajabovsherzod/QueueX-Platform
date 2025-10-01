export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminLoginResponse {
  accessToken: string;
  user: {
    email: string;
    role: string;
  };
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: Date;
  updatedAt: Date;
}


export interface CompanyResponseDTO {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

// Detailed DTO (for admin panel with metadata)
export interface CompanyDetailDTO extends CompanyResponseDTO {
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyRequest {
  name: string;
  slug: string;
  logo?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}
