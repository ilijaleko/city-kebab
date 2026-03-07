import { db } from "@/lib/db";

export async function getGroupByCode(code: string) {
  return db.group.findUnique({
    where: { code },
    include: {
      orders: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function groupExists(code: string): Promise<boolean> {
  const group = await db.group.findUnique({
    where: { code },
    select: { id: true },
  });
  return !!group;
}

export async function getAllGroups() {
  return db.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { price: true } },
    },
  });
}

