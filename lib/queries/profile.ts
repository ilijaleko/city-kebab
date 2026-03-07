import { db } from "@/lib/db";

export async function getUserDefaultName(userId: string): Promise<string> {
  const profile = await db.userProfile.findUnique({
    where: { userId },
    select: { defaultName: true },
  });
  return profile?.defaultName ?? "";
}
