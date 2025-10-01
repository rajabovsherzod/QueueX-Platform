"use client";

import React from "react";
import { Menu, Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-indigo-600 shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left side - Mobile menu button (hidden on desktop) */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-white ml-2 lg:ml-0">
          Dashboard
        </h2>
      </div>

      {/* Right side - User info and notifications */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              Super Administrator
            </p>
            <p className="text-xs text-indigo-200">admin@e-navbat.uz</p>
          </div>
        </div>
      </div>
    </header>
  );
}
