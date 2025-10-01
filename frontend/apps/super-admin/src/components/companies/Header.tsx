import React from "react";
import { Plus } from "lucide-react";

interface HeaderProps {
  onAddCompany: () => void;
}

export const Header = ({ onAddCompany }: HeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Kompaniyalar</h1>
      <p className="text-gray-600 mt-1">
        Tizimda ro'yxatdan o'tgan barcha kompaniyalarni boshqarish
      </p>
    </div>
    <button
      onClick={onAddCompany}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
    >
      <Plus className="w-4 h-4 mr-2" />
      Yangi Kompaniya
    </button>
  </div>
);
