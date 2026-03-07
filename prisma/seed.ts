import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultPrices = [
  { itemKey: "lepinja_mali", price: 5.0 },
  { itemKey: "lepinja_veliki", price: 6.0 },
  { itemKey: "tortilja", price: 7.5 },
  { itemKey: "vegetarijanski", price: 5.0 },
  { itemKey: "tortilja_mix_salata", price: 5.0 },
  { itemKey: "cheese", price: 0.5 },
  { itemKey: "extra_meso", price: 3.0 },
];

async function main() {
  for (const item of defaultPrices) {
    await prisma.priceItem.upsert({
      where: { itemKey: item.itemKey },
      update: { price: item.price },
      create: item,
    });
  }
  console.log("Seeded default prices");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
