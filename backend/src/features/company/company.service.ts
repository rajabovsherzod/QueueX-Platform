import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import ApiError from "@/shared/utils/api.error";
import {
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchResponse,
  BranchDetail,
  BranchStats,
} from "./company.types";

export class CompanyService {
  async getAllBranches(tenantDb: PrismaClient): Promise<BranchResponse[]> {
    try {
      const branches = await tenantDb.branch.findMany({
        include: {
          _count: {
            select: {
              services: true,
              queues: {
                where: {
                  status: "WAITING",
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone || undefined, // Convert null to undefined
        email: undefined, // email field not in schema
        workingHours: undefined, // workingHours field not in schema
        isActive: branch.isActive,
        servicesCount: branch._count.services,
        activeQueuesCount: branch._count.queues,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      }));
    } catch (error: any) {
      throw new ApiError(500, `Failed to fetch branches: ${error.message}`);
    }
  }

  async getBranchById(
    tenantDb: PrismaClient,
    branchId: string
  ): Promise<BranchDetail> {
    try {
      const branch = await tenantDb.branch.findUnique({
        where: { id: branchId },
        include: {
          _count: {
            select: {
              services: true,
              queues: {
                where: {
                  status: "WAITING",
                },
              },
            },
          },
        },
      });

      if (!branch) {
        throw new ApiError(404, "Branch not found");
      }

      // Get branch services
      const services = await tenantDb.service.findMany({
        where: { branchId: branchId },
        select: {
          id: true,
          name: true,
          duration: true, // use duration instead of estimatedTime
          isActive: true,
        },
      });

      // Get today's statistics
      const todayStats = await this.getTodayStats(tenantDb, branchId);

      return {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone || undefined, // Convert null to undefined
        email: undefined, // email field not in schema
        workingHours: undefined, // workingHours field not in schema
        isActive: branch.isActive,
        servicesCount: branch._count.services,
        activeQueuesCount: branch._count.queues,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
        services: services.map((service) => ({
          id: service.id,
          name: service.name,
          estimatedTime: service.duration, // map duration to estimatedTime for response
          isActive: service.isActive,
        })),
        todayStats,
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to fetch branch: ${error.message}`);
    }
  }

  async createBranch(
    tenantDb: PrismaClient,
    data: CreateBranchRequest
  ): Promise<BranchResponse> {
    try {
      // Check if branch name already exists
      const existingBranch = await tenantDb.branch.findFirst({
        where: { name: data.name },
      });

      if (existingBranch) {
        throw new ApiError(400, "Branch with this name already exists");
      }

      const branch = await tenantDb.branch.create({
        data: {
          id: uuidv4(),
          name: data.name,
          address: data.address,
          phone: data.phone,
          isActive: true,
          companyId: "temp-company-id", // This should come from tenant context
        },
        include: {
          _count: {
            select: {
              services: true,
              queues: true,
            },
          },
        },
      });

      return {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone || undefined, // Convert null to undefined
        email: data.email, // keep in response even if not stored
        workingHours: data.workingHours, // keep in response even if not stored
        isActive: branch.isActive,
        servicesCount: branch._count.services,
        activeQueuesCount: branch._count.queues,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to create branch: ${error.message}`);
    }
  }

  async updateBranch(
    tenantDb: PrismaClient,
    branchId: string,
    data: UpdateBranchRequest
  ): Promise<BranchResponse> {
    try {
      // Check if branch exists
      const existingBranch = await tenantDb.branch.findUnique({
        where: { id: branchId },
      });

      if (!existingBranch) {
        throw new ApiError(404, "Branch not found");
      }

      // Check if name is being updated and already exists
      if (data.name && data.name !== existingBranch.name) {
        const nameExists = await tenantDb.branch.findFirst({
          where: {
            name: data.name,
            id: { not: branchId },
          },
        });

        if (nameExists) {
          throw new ApiError(400, "Branch with this name already exists");
        }
      }

      const branch = await tenantDb.branch.update({
        where: { id: branchId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.address && { address: data.address }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          updatedAt: new Date(),
        },
        include: {
          _count: {
            select: {
              services: true,
              queues: {
                where: {
                  status: "WAITING",
                },
              },
            },
          },
        },
      });

      return {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone || undefined, // Convert null to undefined
        email: data.email, // keep in response even if not stored
        workingHours: data.workingHours, // keep in response even if not stored
        isActive: branch.isActive,
        servicesCount: branch._count.services,
        activeQueuesCount: branch._count.queues,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to update branch: ${error.message}`);
    }
  }

  async deleteBranch(tenantDb: PrismaClient, branchId: string): Promise<void> {
    try {
      // Check if branch exists
      const existingBranch = await tenantDb.branch.findUnique({
        where: { id: branchId },
      });[{
        "resource": "/c:/dev/E-navbat/backend/src/features/company/company.controller.ts",
        "owner": "typescript",
        "code": "2341",
        "severity": 8,
        "message": "Property 'getTodayStats' is private and only accessible within class 'CompanyService'.",
        "source": "ts",
        "startLineNumber": 82,
        "startColumn": 46,
        "endLineNumber": 82,
        "endColumn": 59
      }]

      if (!existingBranch) {
        throw new ApiError(404, "Branch not found");
      }

      // Check if branch has active services
      const activeServices = await tenantDb.service.count({
        where: {
          branchId: branchId,
          isActive: true,
        },
      });

      if (activeServices > 0) {
        throw new ApiError(
          400,
          "Cannot delete branch with active services. Please deactivate services first."
        );
      }

      // Check if branch has active queues
      const activeQueues = await tenantDb.queue.count({
        where: {
          branchId: branchId,
          status: { in: ["WAITING", "IN_PROGRESS"] },
        },
      });

      if (activeQueues > 0) {
        throw new ApiError(
          400,
          "Cannot delete branch with active queues. Please complete all queues first."
        );
      }

      await tenantDb.branch.delete({
        where: { id: branchId },
      });
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to delete branch: ${error.message}`);
    }
  }

  private async getTodayStats(
    tenantDb: PrismaClient,
    branchId: string
  ): Promise<BranchStats> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayQueues = await tenantDb.queue.findMany({
      where: {
        branchId: branchId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        bookedAt: true,
      },
    });

    // Calculate average wait time using available fields
    const completedQueues = todayQueues.filter(
      (q) => q.status === "COMPLETED" && q.startedAt && q.bookedAt
    );
    const averageWaitTime =
      completedQueues.length > 0
        ? Math.round(
            completedQueues.reduce((sum, queue) => {
              const waitTime =
                queue.startedAt && queue.bookedAt
                  ? (new Date(queue.startedAt).getTime() -
                      new Date(queue.bookedAt).getTime()) /
                    (1000 * 60)
                  : 0;
              return sum + waitTime;
            }, 0) / completedQueues.length
          )
        : 0;

    return {
      totalQueues: todayQueues.length,
      completedQueues: todayQueues.filter((q) => q.status === "COMPLETED")
        .length,
      waitingQueues: todayQueues.filter((q) => q.status === "WAITING").length,
      averageWaitTime,
    };
  }
}


export default new CompanyService()