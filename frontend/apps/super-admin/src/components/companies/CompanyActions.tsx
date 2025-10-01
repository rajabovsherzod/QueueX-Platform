"use client";

import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Power } from "lucide-react";
import { Company } from "@/types/company";

interface CompanyActionsProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const CompanyActions = ({
  company,
  onEdit,
  onDelete,
  onToggleStatus,
}: CompanyActionsProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit(company);
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 mr-2" />
              Tahrirlash
            </button>
            <button
              onClick={() => {
                onToggleStatus(company.id);
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Power className="w-4 h-4 mr-2" />
              {company.status === "active"
                ? "Faolsizlashtirish"
                : "Faollashtirish"}
            </button>
            <button
              onClick={() => {
                onDelete(company.id);
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              O&apos;chirish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
