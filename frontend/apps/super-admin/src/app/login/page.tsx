"use client";

import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLogin } from "@/hooks/useAuth";
import { LoginFormData } from "@/lib/validations/auth";
import { tokenStorage } from "@/lib/auth/token";

export default function LoginPage() {
  const loginMutation = useLogin();

  const handleLogin = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Debug function to test token
  const testToken = () => {
    console.log("=== MANUAL TOKEN TEST ===");
    const token = tokenStorage.getAccessToken();
    console.log("Token exists:", !!token);
    if (token) {
      console.log("Token preview:", token.substring(0, 50) + "...");
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload:", payload);
        console.log("Expires at:", new Date(payload.exp * 1000));
        console.log("Is expired:", payload.exp * 1000 < Date.now());
      } catch (e) {
        console.error("Token decode error:", e);
      }
    }
  };

  return (
    <div className="w-full mx-auto rounded-md h-screen overflow-hidden">
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={500}
        baseHue={240}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        containerClassName="w-full h-full bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800"
      >
        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={loginMutation.isPending}
        />

        {/* Debug button - only show in development */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={testToken}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            Test Token (Debug)
          </button>
        )}
      </Vortex>
    </div>
  );
}
