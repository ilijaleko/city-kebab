"use server";

import { db } from "@/lib/db";
import { generateCode } from "@/lib/utils/generate-code";
import { redirect } from "next/navigation";
import { groupExists } from "@/lib/queries/groups";

export async function createGroup(locale: string) {
  let code = generateCode();
  let existing = await db.group.findUnique({ where: { code } });
  while (existing) {
    code = generateCode();
    existing = await db.group.findUnique({ where: { code } });
  }

  await db.group.create({
    data: { code },
  });

  redirect(`/${locale}/group/${code}`);
}

export async function checkAndJoinGroup(code: string, locale: string) {
  const exists = await groupExists(code.toUpperCase().trim());
  if (!exists) {
    return { error: "not_found" as const };
  }
  redirect(`/${locale}/group/${code.toUpperCase().trim()}`);
}
