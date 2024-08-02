import { PrismaClient } from '@prisma/client';

// Declare a global variable if it's not already defined
globalThis.prisma = globalThis.prisma || new PrismaClient();

export const db = globalThis.prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}
