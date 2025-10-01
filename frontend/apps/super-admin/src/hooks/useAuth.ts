import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api/auth";
import { LoginResponse } from "@/lib/interfaces/auth";
import { LoginFormData } from "@/lib/validations/auth";
import { tokenStorage } from "@/lib/auth/token";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      console.log("Login mutation onSuccess:", {
        user: data.data.user,
        hasAccessToken: !!data.data.accessToken,
        tokenInStorage: !!tokenStorage.getAccessToken(),
      });

      queryClient.setQueryData(["auth", "user"], data.data.user);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login xatosi:", error);
      console.log("Clearing tokens due to login error");
      tokenStorage.clearTokens();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Logout xatosi:", error);
      tokenStorage.clearTokens();
      window.location.href = "/login";
    },
  });
}

export function useAuthStatus() {
  return {
    isAuthenticated: tokenStorage.isAuthenticated(),
    checkAuth: authAPI.checkAuth,
  };
}
