export interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  status: "active" | "inactive";
  employeeCount: number;
  queuesCount: number;
  createdAt: string;
  logo?: string | null;
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

export interface CompanyDetailDTO extends CompanyResponseDTO {
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export interface AxiosErrorResponse {
  response?: {
    data: ApiError;
    status: number;
    statusText: string;
  };
  message: string;
  code?: string;
}


export type CompaniesApiResponse = ApiResponse<CompanyResponseDTO[]>