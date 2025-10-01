"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/auth/token";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasChecked = useRef(false);  // useRef - persist qiladi

  useEffect(() => {
    // Faqat bir marta tekshiramiz
    if (hasChecked.current) {
      return;
    }

    const checkAuth = () => {
      const authenticated = tokenStorage.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
      hasChecked.current = true;

      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Faqat birinchi marta loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}