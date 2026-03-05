import { db } from "@/lib/db";

export async function getUserRecipes(userId: string) {
  return db.recipe.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecipeById(recipeId: string) {
  return db.recipe.findUnique({ where: { id: recipeId } });
}
