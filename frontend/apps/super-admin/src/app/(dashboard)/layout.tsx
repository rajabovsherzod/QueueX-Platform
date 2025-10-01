"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="h-screen bg-gray-200 p-2.5 overflow-hidden">
        <div className="h-full flex gap-2">
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div
            className={`
              fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-1/5
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <DashboardSidebar />
          </div>

          <div className="flex-1 lg:w-4/5 flex flex-col gap-2 min-w-0">
            <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

            <main className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto">
              <div className="p-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
