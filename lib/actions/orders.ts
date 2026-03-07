"use server";

import { auth } from "@clerk/nextjs/server";
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
}) {
  const { userId } = await auth();
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
      userId: userId ?? null,
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

export async function deleteOrder(orderId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const group = await db.group.findUnique({ where: { id: order.groupId } });
  const isGroupCreator = group?.creatorId === userId;

  if (order.userId !== userId && !isGroupCreator) {
    throw new Error("Unauthorized");
  }

  await db.order.delete({ where: { id: orderId } });
  if (group) revalidatePath(`/group/${group.code}`);
}

export async function updateOrder(data: {
  orderId: string;
  name: string;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const order = await db.order.findUnique({ where: { id: data.orderId } });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Unauthorized");

  await db.order.update({
    where: { id: data.orderId },
    data: {
      name: data.name,
      kebabType: data.kebabType,
      kebabSize: data.kebabSize,
      sauce: data.sauce,
      hasCheese: data.hasCheese,
      adds: data.adds,
    },
  });

  const group = await db.group.findUnique({ where: { id: order.groupId } });
  if (group) revalidatePath(`/group/${group.code}`);
}
