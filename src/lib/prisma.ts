// lib/db.ts

// import { PrismaClient } from "@prisma/client";

import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });
console.log("Prisma Client Initialized", prisma);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
