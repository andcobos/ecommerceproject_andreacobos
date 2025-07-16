'user server';
import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

//function to fetch latest products to return prisma product and convert it to plain js obj
// Get latest products
export async function getLatestProducts(){
    const prisma = new PrismaClient();

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc' },
    });

    return convertToPlainObject(data);
}