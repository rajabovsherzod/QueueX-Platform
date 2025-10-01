import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: StatsCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);
