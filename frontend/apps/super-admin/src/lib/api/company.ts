import { $axios } from "./axios";
import { CreateCompanyFormData } from "@/schemas/companySchema";
import { CompanyResponseDTO, CompaniesApiResponse } from "@/types/company";


export class CompanyService {
  static async createCompany(payload: CreateCompanyFormData): Promise<CompanyResponseDTO> {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });
  
    const { data } = await $axios.post("superadmin/companies", formData);
    return data.data;
  }

  static async getCompanies(): Promise<CompaniesApiResponse> {
    const { data } = await $axios.get<CompaniesApiResponse>("superadmin/companies")
    return data
  }

  static async getCompanyById(id: string): Promise<CompanyResponseDTO> {
    const { data } = await $axios.get<CompanyResponseDTO>(`superadmin/companies/${id}`)
    return data
  }
  static async updateCompany(id: string, payload: Partial<CreateCompanyFormData>): Promise<CreateCompanyResponse> {
    const { data } = await $axios.put<CompanyResponseDTO>(`superadmin/companies/${id}`, payload)
    return data
  }

  static async deleteCompany(id: string) {
    await $axios.delete(`superadmin/companies/${id}`)
  }

  static async toggleCompanyStatus(id: string): Promise<CompanyResponseDTO> {
    const { data } = await $axios.patch<CompanyResponseDTO>(`superadmin/companies/${id}`)
    return data
  }
}

export const companyApi = {
  createCompany: CompanyService.createCompany,
  getCompanies: CompanyService.getCompanies,
  getCompanyById: CompanyService.getCompanyById,
  updateCompany: CompanyService.updateCompany,
  deleteCompany: CompanyService.deleteCompany,
  toggleCompanyStatus: CompanyService.toggleCompanyStatus,
};

export default CompanyService;
