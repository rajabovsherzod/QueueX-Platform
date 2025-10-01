import React from "react";
import {
  Building2,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Company } from "@/types/company";
import { CompanyActions } from "./CompanyActions";

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const CompanyTable = ({
  companies,
  onEdit,
  onDelete,
  onToggleStatus,
}: CompanyTableProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kompaniya
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aloqa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statistika
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Holati
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yaratilgan
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amallar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {company.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {company.address
                        ? `${company.address.substring(0, 30)}...`
                        : "Manzil ko'rsatilmagan"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center mb-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {company.email || "Email ko'rsatilmagan"}
                </div>
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {company.phone || "Telefon ko'rsatilmagan"}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  {company.website || "Website ko'rsatilmagan"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center mb-1">
                  <Users className="w-3 h-3 mr-1" />
                  {company.employeeCount} xodim
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {company.queuesCount} navbat
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    company.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {company.status === "active" ? "Faol" : "Faolsiz"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(company.createdAt).toLocaleDateString("uz-UZ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <CompanyActions
                  company={company}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
