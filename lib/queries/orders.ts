import { db } from "@/lib/db";

export async function getUserOrderHistory(
  userId: string,
  page = 1,
  perPage = 20,
) {
  const orders = await db.order.findMany({
    where: { userId },
    include: {
      group: {
        select: { code: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const total = await db.order.count({ where: { userId } });

  return { orders, total, page, perPage };
}
