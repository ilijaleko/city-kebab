import { db } from "@/lib/db";
import type { PriceMap } from "@/lib/prices";

export async function getPriceMap(): Promise<PriceMap> {
  const items = await db.priceItem.findMany();
  const map: PriceMap = {};
  for (const item of items) {
    map[item.itemKey] = item.price;
  }
  return map;
}
