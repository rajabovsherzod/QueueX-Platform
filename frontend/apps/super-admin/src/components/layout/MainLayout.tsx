"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./header";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page doesn't need dashboard layout
  if (pathname === "/login" || pathname === "/") {
    return <>{children}</>;
  }

  // All other pages use main layout with authentication
  return (
    <AuthGuard>
      <div className="h-screen bg-gray-200 p-2.5 overflow-hidden">
        <div className="h-full flex gap-2">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar - 20% width */}
          <div
            className={`
              fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-1/5
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <DashboardSidebar />
          </div>

          {/* Main content area - 80% width */}
          <div className="flex-1 lg:w-4/5 flex flex-col gap-2 min-w-0">
            {/* Header - sticky */}
            <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

            {/* Main content - scrollable */}
            <main className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto">
              <div className="p-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
