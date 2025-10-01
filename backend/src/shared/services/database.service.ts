import { PrismaClient } from "@prisma/client";
import ApiError from "@/shared/utils/api.error";

interface DatabaseConfig {
  host: string;
  database: string;
  username: string;
  password: string;
  port?: number;
}

class DatabaseService {
  private connections: Map<string, PrismaClient> = new Map();

  generateDatabaseName(companySlug: string): string {
    return `queuex_${companySlug.replace(/-/g, "_")}`;
  }
  generateDatabaseCredentials(companySlug: string): DatabaseConfig {
    const dbName = this.generateDatabaseName(companySlug);

    return {
      host: process.env.DB_HOST || "localhost",
      database: dbName,
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      port: parseInt(process.env.DB_PORT || "5432"),
    };
  }

  createDatabaseUrl(config: DatabaseConfig): string {
    return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?schema=public`;
  }
  async createCompanyDatabase(companySlug: string): Promise<DatabaseConfig> {
    const config = this.generateDatabaseCredentials(companySlug);

    try {
      const adminClient = new PrismaClient({
        datasources: {
          db: {
            url: `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/postgres?schema=public`,
          },
        },
      });

      await adminClient.$executeRawUnsafe(
        `CREATE DATABASE "${config.database}"`
      );
      await adminClient.$disconnect();
      const companyClient = new PrismaClient({
        datasources: {
          db: {
            url: this.createDatabaseUrl(config),
          },
        },
      });

      await this.runMigrations(companyClient);

      this.connections.set(companySlug, companyClient);

      return config;
    } catch (error: any) {
      throw new ApiError(500, `Database creation failed: ${error.message}`);
    }
  }

  private async runMigrations(client: PrismaClient): Promise<void> {
    try {
      await client.$executeRaw`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `;

      // Create company-specific tables
      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "queues" (
          "id" TEXT NOT NULL,
          "number" INTEGER NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'WAITING',
          "priority" INTEGER NOT NULL DEFAULT 1,
          "customerId" TEXT,
          "serviceId" TEXT NOT NULL,
          "branchId" TEXT NOT NULL,
          "operatorId" TEXT,
          "estimatedTime" INTEGER,
          "actualTime" INTEGER,
          "notes" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "queues_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "services" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "estimatedTime" INTEGER NOT NULL DEFAULT 15,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "branchId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "services_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "branches" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "address" TEXT NOT NULL,
          "phone" TEXT,
          "email" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "workingHours" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "customers" (
          "id" TEXT NOT NULL,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "phone" TEXT,
          "email" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "analytics" (
          "id" TEXT NOT NULL,
          "date" DATE NOT NULL,
          "totalQueues" INTEGER NOT NULL DEFAULT 0,
          "completedQueues" INTEGER NOT NULL DEFAULT 0,
          "averageWaitTime" INTEGER NOT NULL DEFAULT 0,
          "branchId" TEXT NOT NULL,
          "serviceId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
        );
      `;

      console.log("✅ Company database tables created successfully");
    } catch (error: any) {
      throw new ApiError(500, `Migration failed: ${error.message}`);
    }
  }

  async getCompanyConnection(companySlug: string): Promise<PrismaClient> {
    if (this.connections.has(companySlug)) {
      return this.connections.get(companySlug)!;
    }
    const config = this.generateDatabaseCredentials(companySlug);
    const client = new PrismaClient({
      datasources: {
        db: {
          url: this.createDatabaseUrl(config),
        },
      },
    });

    this.connections.set(companySlug, client);
    return client;
  }

  async closeCompanyConnection(companySlug: string): Promise<void> {
    const client = this.connections.get(companySlug);
    if (client) {
      await client.$disconnect();
      this.connections.delete(companySlug);
    }
  }

  async closeAllConnections(): Promise<void> {
    for (const [slug, client] of this.connections) {
      await client.$disconnect();
    }
    this.connections.clear();
  }

  async deleteCompanyDatabase(companySlug: string): Promise<void> {
    const config = this.generateDatabaseCredentials(companySlug);

    try {
      await this.closeCompanyConnection(companySlug);

      const adminClient = new PrismaClient({
        datasources: {
          db: {
            url: `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/postgres?schema=public`,
          },
        },
      });

      await adminClient.$executeRawUnsafe(
        `DROP DATABASE IF EXISTS "${config.database}"`
      );
      await adminClient.$disconnect();
    } catch (error: any) {
      throw new ApiError(500, `Database deletion failed: ${error.message}`);
    }
  }

  // Enterprise-level: Branch database creation
  async createBranchDatabase(
    companySlug: string,
    branchSlug: string
  ): Promise<DatabaseConfig> {
    const config = this.generateBranchDatabaseCredentials(
      companySlug,
      branchSlug
    );

    try {
      const adminClient = new PrismaClient({
        datasources: {
          db: {
            url: `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/postgres?schema=public`,
          },
        },
      });

      await adminClient.$executeRawUnsafe(
        `CREATE DATABASE "${config.database}"`
      );
      await adminClient.$disconnect();

      const branchClient = new PrismaClient({
        datasources: {
          db: {
            url: this.createDatabaseUrl(config),
          },
        },
      });

      await this.runBranchMigrations(branchClient);

      const connectionKey = `${companySlug}_${branchSlug}`;
      this.connections.set(connectionKey, branchClient);

      return config;
    } catch (error: any) {
      throw new ApiError(
        500,
        `Branch database creation failed: ${error.message}`
      );
    }
  }

  generateBranchDatabaseCredentials(
    companySlug: string,
    branchSlug: string
  ): DatabaseConfig {
    const dbName = `queuex_${companySlug}_${branchSlug}`.replace(/-/g, "_");

    return {
      host: process.env.DB_HOST || "localhost",
      database: dbName,
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      port: parseInt(process.env.DB_PORT || "5432"),
    };
  }

  private async runBranchMigrations(client: PrismaClient): Promise<void> {
    try {
      await client.$executeRaw`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `;

      // Branch-specific tables only
      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "queues" (
          "id" TEXT NOT NULL,
          "number" INTEGER NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'WAITING',
          "priority" INTEGER NOT NULL DEFAULT 1,
          "customerId" TEXT,
          "serviceId" TEXT NOT NULL,
          "operatorId" TEXT,
          "estimatedTime" INTEGER,
          "actualTime" INTEGER,
          "notes" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "queues_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "services" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "estimatedTime" INTEGER NOT NULL DEFAULT 15,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "services_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "customers" (
          "id" TEXT NOT NULL,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "phone" TEXT,
          "email" TEXT,
          "visitCount" INTEGER NOT NULL DEFAULT 1,
          "lastVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
        );
      `;

      await client.$executeRaw`
        CREATE TABLE IF NOT EXISTS "branch_analytics" (
          "id" TEXT NOT NULL,
          "date" DATE NOT NULL,
          "totalQueues" INTEGER NOT NULL DEFAULT 0,
          "completedQueues" INTEGER NOT NULL DEFAULT 0,
          "averageWaitTime" INTEGER NOT NULL DEFAULT 0,
          "peakHour" INTEGER,
          "serviceId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "branch_analytics_pkey" PRIMARY KEY ("id")
        );
      `;

      console.log("✅ Branch database tables created successfully");
    } catch (error: any) {
      throw new ApiError(500, `Branch migration failed: ${error.message}`);
    }
  }

  async getBranchConnection(
    companySlug: string,
    branchSlug: string
  ): Promise<PrismaClient> {
    const connectionKey = `${companySlug}_${branchSlug}`;

    if (this.connections.has(connectionKey)) {
      return this.connections.get(connectionKey)!;
    }

    const config = this.generateBranchDatabaseCredentials(
      companySlug,
      branchSlug
    );
    const client = new PrismaClient({
      datasources: {
        db: {
          url: this.createDatabaseUrl(config),
        },
      },
    });

    this.connections.set(connectionKey, client);
    return client;
  }
}

export default new DatabaseService();
