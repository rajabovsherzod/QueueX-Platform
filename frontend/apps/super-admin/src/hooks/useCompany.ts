import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyApi } from "@/lib/api/company";
import { CreateCompanyFormData } from "@/schemas/companySchema";
import { CompanyResponseDTO } from "@/types/company";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters: string) => [...companyKeys.lists(), { filters }] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

export const useCompanies = () => {
  return useQuery({
    queryKey: companyKeys.lists(),
    queryFn: companyApi.getCompanies,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companyApi.getCompanyById(id),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyFormData) => companyApi.createCompany(data),
    onSuccess: (data: CompanyResponseDTO) => { 
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.setQueryData(companyKeys.detail(data.id), data);
      toast.success("Kompaniya muvaffaqiyatli yaratildi!", {
        description: `${data.name} kompaniyasi tizimga qo'shildi.`
      });
    },
    onError: (error: ApiError) => {
      console.error("Create company error:", error);
      toast.error("Kompaniya yaratishda xatolik!", {
        description:
          error?.response?.data?.message || "Iltimos, qaytadan urinib ko'ring.",
      });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCompanyFormData>;
    }) => companyApi.updateCompany(id, data),
    onSuccess: (data: CompanyResponseDTO, variables) => {
      queryClient.setQueryData(companyKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      toast.success("Kompaniya ma'lumotlari yangilandi!", {
        description: `${data.name} kompaniyasi muvaffaqiyatli yangilandi.`,
      });
    },
    onError: (error: ApiError) => {
      console.error("Update company error:", error);
      toast.error("Kompaniya yangilashda xatolik!", {
        description:
          error?.response?.data?.message || "Iltimos, qaytadan urinib ko'ring.",
      });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyApi.deleteCompany(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: companyKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      toast.success("Kompaniya o'chirildi!", {
        description: "Kompaniya tizimdan muvaffaqiyatli olib tashlandi.",
      });
    },
    onError: (error: ApiError) => {
      console.error("Delete company error:", error);
      toast.error("Kompaniya o'chirishda xatolik!", {
        description:
          error?.response?.data?.message || "Iltimos, qaytadan urinib ko'ring.",
      });
    },
  });
};

export const useToggleCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyApi.toggleCompanyStatus(id),
    onSuccess: (data: CompanyResponseDTO, id) => {
      queryClient.setQueryData(companyKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      const statusText =
        data.status === "ACTIVE"
          ? "faollashtirildi"
          : "faolsizlashtirildi";
      toast.success(`Kompaniya ${statusText}!`, {
        description: `${data.name} kompaniyasi holati o'zgartirildi.`,
      });
    },
    onError: (error: ApiError) => {
      console.error("Toggle company status error:", error);
      toast.error("Kompaniya holatini o'zgartirishda xatolik!", {
        description:
          error?.response?.data?.message || "Iltimos, qaytadan urinib ko'ring.",
      });
    },
  });
};
