import React from "react";
import { Building2 } from "lucide-react";

interface EmptyStateProps {
  searchTerm?: string;
  statusFilter?: "all" | "active" | "inactive";
  onClearFilters?: () => void;
}

export const EmptyState = ({
  searchTerm,
  statusFilter,
  onClearFilters,
}: EmptyStateProps) => (
  <div className="text-center py-12">
    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Kompaniyalar topilmadi
    </h3>
    <p className="text-gray-500 mb-4">
      Qidiruv shartlaringizni o'zgartiring yoki yangi kompaniya qo'shing
    </p>
    {(searchTerm || statusFilter !== "all") && onClearFilters && (
      <button
        onClick={onClearFilters}
        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        Filtrlarni tozalash
      </button>
    )}
  </div>
);
