import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
    const prisma = new PrismaClient();
    //eliminar datos que ya estan en la base de datos
    await prisma.product.deleteMany();

    //crear producto
    await prisma.product.createMany({data: sampleData.products});

    console.log("Sample data seeded successfully.");
}

main();