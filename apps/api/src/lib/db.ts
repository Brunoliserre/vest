import { prisma } from '@ecommerce/database';

export { prisma };

// Opcional: helpers
export const disconnect = async () => {
    await prisma.$disconnect();
};

export const healthCheck = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch {
        return false;
    }
};
