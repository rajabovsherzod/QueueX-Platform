"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Shield, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmitHandler: SubmitHandler<LoginFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="relative w-full max-w-md z-10">
      {/* Glowing Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-25"></div>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Boshqaruv Paneli
          </h1>
          <p className="text-indigo-200 text-sm">
            O&apos;zbekiston Respublikasi Davlat Tizimi
          </p>
          <p className="text-indigo-300 text-xs mt-1">admin.enavbat.uz</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-indigo-100"
            >
              Elektron pochta manzili
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-indigo-300" />
              </div>
              <Input
                {...register("email")}
                id="email"
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="admin@enavbat.uz"
              />
            </div>
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-indigo-100"
            >
              Parol
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-300" />
              </div>
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register("rememberMe")}
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <Label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-indigo-200"
              >
                Meni eslab qol
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-indigo-300 hover:text-white transition-colors"
            >
              Parolni unutdingizmi?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Kirilmoqda...
              </div>
            ) : (
              "Boshqaruv Paneliga Kirish"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-indigo-300">
            2024 O&apos;zbekiston Respublikasi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
}
