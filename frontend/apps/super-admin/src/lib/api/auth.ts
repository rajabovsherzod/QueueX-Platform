import { axiosInstance } from "./axios";
import { tokenStorage } from "@/lib/auth/token";
import { LoginFormData } from "@/lib/validations/auth";
import { LoginResponse } from "../interfaces/auth";

export const authAPI = {
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    // Backend faqat email va password kutadi, rememberMe ni yubormaymiz
    const loginData = {
      email: credentials.email,
      password: credentials.password,
    };

    console.log("Login request starting...", loginData);

    const response = await axiosInstance.post<LoginResponse>(
      "/superadmin/login",
      loginData
    );

    console.log("Login response received:", {
      status: response.status,
      data: response.data,
      hasData: !!response.data.data,
      hasAccessToken: !!response.data.data?.accessToken,
      accessTokenPreview: response.data.data?.accessToken
        ? `${response.data.data.accessToken.substring(0, 20)}...`
        : "No token",
    });

    const { accessToken } = response.data.data;

    if (!accessToken) {
      console.error("No access token in response!");
      throw new Error("Access token not received from server");
    }

    console.log("Saving token to localStorage...");
    tokenStorage.setAccessToken(accessToken);

    // Verify token was saved
    const savedToken = tokenStorage.getAccessToken();
    console.log("Token verification after save:", {
      tokenSaved: !!savedToken,
      tokensMatch: savedToken === accessToken,
    });

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/superadmin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenStorage.clearTokens();
    }
  },

  checkAuth: (): boolean => {
    return tokenStorage.isAuthenticated();
  },
};
