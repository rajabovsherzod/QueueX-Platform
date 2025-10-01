import React from "react";
import { Search, Filter } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Filters = ({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
}: FiltersProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Kompaniya nomi yoki email bo'yicha qidirish..."
          value={searchTerm}
          onChange={onSearchTermChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={onStatusFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Barcha holatlar</option>
          <option value="active">Faol</option>
          <option value="inactive">Faolsiz</option>
        </select>
      </div>
    </div>
  </div>
);
