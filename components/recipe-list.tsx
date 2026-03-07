"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADDONS_EMOJIS } from "@/lib/kebab-config";
import { deleteRecipe } from "@/lib/actions/recipes";

type RecipeListProps = {
  recipes: Array<{
    id: string;
    name: string;
    userName: string | null;
    kebabType: string;
    kebabSize: string | null;
    sauce: string;
    hasCheese: boolean | null;
    adds: string[];
  }>;
};

export function RecipeList({ recipes }: RecipeListProps) {
  const t = useTranslations("recipe");
  const tKebab = useTranslations("kebab");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  function handleDelete(recipeId: string, recipeName: string) {
    startTransition(async () => {
      try {
        await deleteRecipe(recipeId);
        toast.success(t("deleted", { name: recipeName }));
      } catch {
        toast.error("Failed to delete recipe");
      }
    });
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 py-12 text-center">
        <BookOpen className="h-10 w-10 mx-auto mb-3 text-stone-300 dark:text-stone-600" />
        <p className="text-sm text-stone-400 dark:text-stone-500">
          {t("noRecipes")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-medium text-sm text-stone-900 dark:text-stone-50 truncate">
              {recipe.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-stone-400 dark:text-stone-600 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer"
              disabled={isPending}
              onClick={() => handleDelete(recipe.id, recipe.name)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{tCommon("delete")}</span>
            </Button>
          </div>
          {recipe.userName && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">
              {tKebab("name")}: {recipe.userName}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 text-xs text-stone-600 dark:text-stone-400">
            <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
              {tKebab(`types.${recipe.kebabType}`)}
            </span>
            {recipe.kebabSize && (
              <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                {tKebab(`sizes.${recipe.kebabSize}`)}
              </span>
            )}
            <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
              {tKebab(`sauces.${recipe.sauce}`)}
            </span>
            {recipe.hasCheese && (
              <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                {tKebab("cheese")}
              </span>
            )}
            {recipe.adds.length > 0 &&
              recipe.adds.map((addon) => (
                <span
                  key={addon}
                  className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md"
                >
                  {ADDONS_EMOJIS[addon] || ""} {tKebab(`adds.${addon}`)}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
