import axios, { AxiosInstance, AxiosResponse, AxiosRequestHeaders } from "axios";
import { tokenStorage } from "@/lib/auth/token";
import { handleApiError } from "@/lib/utils/errorHandler";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const isBrowser = typeof window !== "undefined";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const $axios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 Public API: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Public Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`❌ Public Error: ${error.response?.status} ${error.config?.url}`);
    }
    
    handleApiError(error, 'public-api');
    return Promise.reject(error);
  }
);


$axios.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Auth API: ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        isFormData: config.data instanceof FormData
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

$axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Auth Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting token refresh...');
        
        // Use public instance for refresh (no token needed)
        const refreshResponse = await axiosInstance.post('/auth/refresh');
        const newAccessToken = refreshResponse.data.accessToken;
        
        tokenStorage.setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        console.log('✅ Token refreshed successfully');
        return $axios(originalRequest);
        
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError);
        tokenStorage.clearTokens();

        if (isBrowser) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`❌ Auth Error: ${error.response?.status} ${error.config?.url}`);
    }

    handleApiError(error, 'auth-api');
    return Promise.reject(error);
  }
);

export default $axios;