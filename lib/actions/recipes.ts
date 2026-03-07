"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveRecipe(data: {
  name: string;
  userName?: string | null;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.recipe.findFirst({
    where: { userId, name: data.name },
  });

  if (existing) {
    await db.recipe.update({
      where: { id: existing.id },
      data: {
        userName: data.userName ?? null,
        kebabType: data.kebabType,
        kebabSize: data.kebabSize,
        sauce: data.sauce,
        hasCheese: data.hasCheese,
        adds: data.adds,
      },
    });
  } else {
    await db.recipe.create({
      data: {
        userId,
        name: data.name,
        userName: data.userName ?? null,
        kebabType: data.kebabType,
        kebabSize: data.kebabSize,
        sauce: data.sauce,
        hasCheese: data.hasCheese,
        adds: data.adds,
      },
    });
  }

  revalidatePath("/[locale]/dashboard/recipes", "page");
}

export async function deleteRecipe(recipeId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe || recipe.userId !== userId) throw new Error("Unauthorized");

  await db.recipe.delete({ where: { id: recipeId } });
  revalidatePath("/[locale]/dashboard/recipes", "page");
}
