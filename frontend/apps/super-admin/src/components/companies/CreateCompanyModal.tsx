"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Link,
  Upload,
  X,
} from "lucide-react";
import {
  createCompanySchema,
  CreateCompanyFormData,
} from "@/schemas/companySchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateCompany } from "@/hooks/useCompany";
import { debugLocalStorage, tokenStorage } from "@/lib/auth/token";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateCompanyFormData) => Promise<void>;
  isLoading?: boolean;
}

export const CreateCompanyModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateCompanyModalProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const createCompanyMutation = useCreateCompany();

  // Debug localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      debugLocalStorage();
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const watchName = watch("name");

  React.useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      setValue("slug", slug);
    }
  }, [watchName, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: CreateCompanyFormData) => {
    const cleanedData = {
      ...data,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
    };

    createCompanyMutation.mutate(cleanedData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[90%] sm:w-[70%] lg:w-[50%] max-w-4xl max-h-[85vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center space-y-0 space-x-3 pb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Yangi Kompaniya Qo'shish
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Kompaniya ma'lumotlarini to'ldiring
            </DialogDescription>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={createCompanyMutation.isPending}
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Row 1: Company Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Kompaniya Nomi *
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Kompaniya nomini kiriting"
                disabled={createCompanyMutation.isPending}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Link className="w-4 h-4 inline mr-2" />
                Slug *
              </label>
              <input
                {...register("slug")}
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="kompaniya-slug"
                disabled={createCompanyMutation.isPending}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="info@kompaniya.uz"
                disabled={createCompanyMutation.isPending}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefon
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+998 90 123 45 67"
                disabled={createCompanyMutation.isPending}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Address & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Manzil
              </label>
              <textarea
                {...register("address")}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Kompaniya manzilini kiriting"
                disabled={createCompanyMutation.isPending}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Website
              </label>
              <input
                {...register("website")}
                type="url"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://kompaniya.uz"
                disabled={createCompanyMutation.isPending}
              />
              {errors.website && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Logo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  disabled={createCompanyMutation.isPending}
                />
                {errors.logo && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.logo.message}
                  </p>
                )}
              </div>
              {logoPreview && (
                <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200 flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={createCompanyMutation.isPending}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createCompanyMutation.isPending}
            >
              {createCompanyMutation.isPending
                ? "Saqlanmoqda..."
                : "Kompaniya Qo'shish"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
