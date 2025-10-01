import React from "react";
import { Building2, Power, Users } from "lucide-react";

export const CompaniesLoading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 border rounded"
              >
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
