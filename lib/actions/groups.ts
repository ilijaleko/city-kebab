"use server";

import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { groupExists } from "@/lib/queries/groups";
import { generateCode } from "@/lib/utils/generate-code";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGroup(locale: string) {
  const { userId } = await auth();

  let code = generateCode();
  let existing = await db.group.findUnique({ where: { code } });
  while (existing) {
    code = generateCode();
    existing = await db.group.findUnique({ where: { code } });
  }

  await db.group.create({
    data: { code, creatorId: userId },
  });

  redirect(`/${locale}/group/${code}`);
}

export async function deleteGroup(groupId: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.group.delete({ where: { id: groupId } });
  revalidatePath("/[locale]/dashboard/admin");
}

export async function checkAndJoinGroup(code: string, locale: string) {
  const exists = await groupExists(code.toUpperCase().trim());
  if (!exists) {
    return { error: "not_found" as const };
  }
  redirect(`/${locale}/group/${code.toUpperCase().trim()}`);
}

