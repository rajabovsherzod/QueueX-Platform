"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/auth/token";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = tokenStorage.isAuthenticated();

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  );
}
