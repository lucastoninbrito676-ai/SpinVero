
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Reutiliza a instância do Prisma durante o desenvolvimento.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Cria ou reutiliza a conexão com o banco.
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

// Evita múltiplas instâncias durante o desenvolvimento.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
