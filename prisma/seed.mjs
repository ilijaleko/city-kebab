import pg from "pg";

const defaultPrices = [
  { itemKey: "lepinja_mali", price: 5.0 },
  { itemKey: "lepinja_veliki", price: 6.0 },
  { itemKey: "tortilja", price: 7.5 },
  { itemKey: "vegetarijanski", price: 5.0 },
  { itemKey: "tortilja_mix_salata", price: 5.0 },
  { itemKey: "cheese", price: 0.5 },
  { itemKey: "extra_meso", price: 3.0 },
];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  let count = 0;
  for (const item of defaultPrices) {
    const result = await pool.query(
      `INSERT INTO "PriceItem" (id, "itemKey", price)
       VALUES (gen_random_uuid(), $1, $2)
       ON CONFLICT ("itemKey") DO NOTHING`,
      [item.itemKey, item.price],
    );
    count += result.rowCount;
  }
  console.log(`Seeded ${count} new price items`);
} catch (e) {
  console.error("Seed failed:", e);
  process.exit(1);
} finally {
  await pool.end();
}

