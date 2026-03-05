"use server";

import { db } from "@/lib/db";
import { addOrderSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function addOrder(data: {
  groupCode: string;
  name: string;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
  userId?: string | null;
}) {
  const parsed = addOrderSchema.parse(data);

  const group = await db.group.findUnique({
    where: { code: parsed.groupCode },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  await db.order.create({
    data: {
      groupId: group.id,
      userId: parsed.userId ?? null,
      name: parsed.name,
      kebabType: parsed.kebabType,
      kebabSize: parsed.kebabSize,
      sauce: parsed.sauce,
      hasCheese: parsed.hasCheese,
      adds: parsed.adds,
    },
  });

  revalidatePath(`/group/${parsed.groupCode}`);
}
