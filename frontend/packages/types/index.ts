export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  companyId: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}
