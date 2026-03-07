"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function saveDefaultName(defaultName: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.userProfile.upsert({
    where: { userId },
    update: { defaultName },
    create: { userId, defaultName },
  });
}
