export interface LoginResponse {
  data: {
    accessToken: string;
    user: {
      email: string;
      role: string;
    };
  };
  message: string;
  success: boolean;
}
