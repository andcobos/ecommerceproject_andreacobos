'use server';
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

//function to fetch latest products to return prisma product and convert it to plain js obj
// Get latest products
export async function getLatestProducts(){

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc' },
    });

    return convertToPlainObject(data);
}

//get single product by its slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
}