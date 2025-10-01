"use client";

import React from "react";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Activity,
  BarChart3,
  Plus,
  Eye,
  Settings,
} from "lucide-react";

const stats = [
  {
    name: "Jami Foydalanuvchilar",
    value: "2,847",
    change: "+12%",
    changeType: "increase",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "Faol Kompaniyalar",
    value: "156",
    change: "+8%",
    changeType: "increase",
    icon: Building2,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    name: "Bugungi Navbatlar",
    value: "1,234",
    change: "+23%",
    changeType: "increase",
    icon: Calendar,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    name: "Yakunlangan Navbatlar",
    value: "892",
    change: "+15%",
    changeType: "increase",
    icon: CheckCircle,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "user_registered",
    message: "Yangi foydalanuvchi ro'yxatdan o'tdi",
    user: "Alisher Karimov",
    time: "5 daqiqa oldin",
    avatar: "AK",
    color: "bg-blue-500",
  },
  {
    id: 2,
    type: "company_added",
    message: "Yangi kompaniya qo'shildi",
    user: "TechCorp LLC",
    time: "15 daqiqa oldin",
    avatar: "TC",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    type: "queue_completed",
    message: "Navbat yakunlandi",
    user: "Bank filiali #1",
    time: "30 daqiqa oldin",
    avatar: "BF",
    color: "bg-purple-500",
  },
  {
    id: 4,
    type: "system_update",
    message: "Tizim yangilandi",
    user: "System Admin",
    time: "1 soat oldin",
    avatar: "SA",
    color: "bg-gray-500",
  },
];

const quickActions = [
  {
    title: "Yangi Kompaniya",
    description: "Tizimga yangi kompaniya qo'shish",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    href: "/companies/create",
  },
  {
    title: "Foydalanuvchilar",
    description: "Barcha foydalanuvchilarni ko'rish",
    icon: Users,
    color: "from-emerald-500 to-emerald-600",
    href: "/users",
  },
  {
    title: "Hisobotlar",
    description: "Tizim hisobotlarini ko'rish",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
    href: "/reports",
  },
  {
    title: "Sozlamalar",
    description: "Tizim sozlamalarini boshqarish",
    icon: Settings,
    color: "from-orange-500 to-orange-600",
    href: "/settings",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">
            Xush kelibsiz, Super Admin! 👋
          </h1>
          <p className="text-indigo-100 text-lg">
            E-Navbat tizimi boshqaruv paneli - Bugun{" "}
            {new Date().toLocaleDateString("uz-UZ")}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/5"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.name}
                </p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-emerald-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color}`}
            ></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                  So'nggi Faoliyat
                </h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                  Barchasini ko'rish
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full ${activity.color} flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        <span className="text-gray-600">
                          {activity.message}
                        </span>
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-indigo-600" />
                Tezkor Amallar
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-50 to-white p-4 text-left hover:from-gray-100 hover:to-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}
                    >
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-gray-800">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-indigo-600" />
                Tizim Holati
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server</span>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">
                    Faol
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Ma'lumotlar bazasi
                </span>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">
                    Ulangan
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">
                    Ishlayapti
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
