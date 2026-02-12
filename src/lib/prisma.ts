import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const getPrismaClient = () => {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
  // Fallback for build time if URL is missing
  return new PrismaClient();
};

const prisma = global.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
