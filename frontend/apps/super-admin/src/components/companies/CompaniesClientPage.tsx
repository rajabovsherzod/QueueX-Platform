"use client";

import React, { useState } from "react";
import { Building2, Power, Users } from "lucide-react";
import { Company } from "@/types/company";
import { StatsCard } from "@/components/ui/StatsCard";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { Header } from "@/components/companies/Header";
import { Filters } from "@/components/companies/Filters";
import { EmptyState } from "@/components/companies/EmptyState";
import { CreateCompanyModal } from "@/components/companies/CreateCompanyModal";
import { CreateCompanyFormData } from "@/schemas/companySchema";
import { companyApi } from "@/lib/api/company";

interface CompaniesClientPageProps {
  initialCompanies: Company[];
}

export const CompaniesClientPage = ({
  initialCompanies,
}: CompaniesClientPageProps) => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.email &&
        company.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.status === "active").length,
    inactive: companies.filter((c) => c.status === "inactive").length,
    totalEmployees: companies.reduce((sum, c) => sum + c.employeeCount, 0),
  };

  const handleEdit = (company: Company) => {
    console.log("Edit company:", company);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Kompaniyani o'chirishni xohlaysizmi?")) {
      try {
        await companyApi.deleteCompany(id);
        setCompanies(companies.filter((c) => c.id !== id));
        alert("Kompaniya muvaffaqiyatli o'chirildi!");
      } catch (error) {
        console.error("Error deleting company:", error);
        alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await companyApi.toggleCompanyStatus(id);
      setCompanies(
        companies.map((c) =>
          c.id === id
            ? { ...c, status: c.status === "active" ? "inactive" : "active" }
            : c
        )
      );
    } catch (error) {
      console.error("Error toggling company status:", error);
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  const handleAddCompany = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateCompany = async (data: CreateCompanyFormData) => {
    setIsCreating(true);

    try {
      const response = await companyApi.createCompany(data);

      // CreateCompanyResponse has { success, message, data: CompanyResponseDTO }
      const newCompany: Company = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        website: response.data.website || "",
        status: response.data.status === "ACTIVE" ? "active" : "inactive",
        employeeCount: 0,
        queuesCount: 0,
        createdAt: new Date().toISOString().split("T")[0], // Use current date
      };

      setCompanies((prev) => [newCompany, ...prev]);
      setIsCreateModalOpen(false);

      alert("Kompaniya muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Header onAddCompany={handleAddCompany} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Jami Kompaniyalar"
          value={stats.total.toString()}
          icon={Building2}
          color="bg-blue-500"
        />
        <StatsCard
          title="Faol Kompaniyalar"
          value={stats.active.toString()}
          icon={Power}
          color="bg-green-500"
        />
        <StatsCard
          title="Faolsiz Kompaniyalar"
          value={stats.inactive.toString()}
          icon={Power}
          color="bg-red-500"
        />
        <StatsCard
          title="Jami Xodimlar"
          value={stats.totalEmployees.toString()}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <Filters
            searchTerm={searchTerm}
            onSearchTermChange={(e) => setSearchTerm(e.target.value)}
            statusFilter={statusFilter}
            onStatusFilterChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
          />
        </div>

        <div className="p-6">
          {filteredCompanies.length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onClearFilters={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            />
          ) : (
            <CompanyTable
              companies={filteredCompanies}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      </div>

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCompany}
        isLoading={isCreating}
      />
    </div>
  );
};
