import { PrismaClient } from '@prisma/client';

type ExtendedPrismaClient = typeof client;

declare global {
  // Use the extended Prisma client type
  var prisma: ExtendedPrismaClient | undefined;
}

const client = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});

export const prisma = globalThis.prisma || client;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
