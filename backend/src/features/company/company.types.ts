// Branch related types and interfaces
export interface CreateBranchRequest {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  workingHours?: string;
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  isActive?: boolean;
}

export interface BranchResponse {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  isActive: boolean;
  servicesCount?: number;
  activeQueuesCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchDetail extends BranchResponse {
  services: ServiceSummary[];
  todayStats: BranchStats;
}

export interface ServiceSummary {
  id: string;
  name: string;
  estimatedTime: number;
  isActive: boolean;
}

export interface BranchStats {
  totalQueues: number;
  completedQueues: number;
  waitingQueues: number;
  averageWaitTime: number;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  estimatedTime: number;
  branchId: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  estimatedTime?: number;
  isActive?: boolean;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description?: string;
  estimatedTime: number;
  isActive: boolean;
  branchId: string;
  branchName: string;
  createdAt: Date;
  updatedAt: Date;
}
