"use server";

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updatePrices(
  items: { itemKey: string; price: number }[],
) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  for (const item of items) {
    await db.priceItem.upsert({
      where: { itemKey: item.itemKey },
      update: { price: item.price },
      create: { itemKey: item.itemKey, price: item.price },
    });
  }

  revalidatePath("/[locale]", "page");
}
