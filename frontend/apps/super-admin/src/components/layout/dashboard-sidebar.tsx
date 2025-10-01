"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    active: true,
  },
  {
    icon: Users,
    label: "Foydalanuvchilar",
    href: "/dashboard/users",
    active: false,
  },
  {
    icon: Building2,
    label: "Kompaniyalar",
    href: "/companies",
    active: false,
  },
  {
    icon: Calendar,
    label: "Navbatlar",
    href: "/dashboard/queues",
    active: false,
  },
  {
    icon: Settings,
    label: "Sozlamalar",
    href: "/dashboard/settings",
    active: false,
  },
];

export function DashboardSidebar() {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="h-full bg-white shadow-lg flex flex-col">
      {/* Sidebar header */}
      <div className="h-16 px-6 bg-indigo-600 flex items-center">
        <h1 className="text-xl font-bold text-white">E-Navbat Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${
                item.active
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {logoutMutation.isPending ? "Chiqilmoqda..." : "Chiqish"}
        </button>
      </div>
    </div>
  );
}
