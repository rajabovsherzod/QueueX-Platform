"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Company, CompanyResponseDTO, CompaniesApiResponse } from "@/types/company";
import { companyApi } from "@/lib/api/company";
import { CompaniesClientPage } from "@/components/companies/CompaniesClientPage";
import { CompaniesLoading } from "@/components/companies/CompaniesLoading";

const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<Company[]> => {
      const response: CompaniesApiResponse = await companyApi.getCompanies();

      const companiesData: CompanyResponseDTO[] = Array.isArray(response)
      ? response
      : (response as CompaniesApiResponse).data;

      return companiesData.map((company: CompanyResponseDTO) => ({
        id: company.id,
        name: company.name,
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        website: company.website || "",
        status: company.status === "ACTIVE" ? "active" : "inactive",
        employeeCount: 0,
        queuesCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

const CompaniesPageClient = () => {
  const { data: companies = [], isLoading, error } = useCompanies();

  if (isLoading) {
    return <CompaniesLoading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Xatolik yuz berdi
          </h2>
          <p className="text-gray-600 mb-4">Ma&apos;lumotlarni yuklashda xatolik</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return <CompaniesClientPage initialCompanies={companies} />;
};

export default CompaniesPageClient;