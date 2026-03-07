"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>{t("noRecipes")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {recipes.map((recipe) => (
        <Card key={recipe.id}>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{recipe.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isPending}
                onClick={() => handleDelete(recipe.id, recipe.name)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{tCommon("delete")}</span>
              </Button>
            </div>
            {recipe.userName && (
              <p className="text-sm text-muted-foreground">
                {tKebab("name")}: {recipe.userName}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs">
                {tKebab(`types.${recipe.kebabType}`)}
              </span>
              {recipe.kebabSize && (
                <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs">
                  {tKebab(`sizes.${recipe.kebabSize}`)}
                </span>
              )}
              <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs">
                {tKebab(`sauces.${recipe.sauce}`)}
              </span>
              {recipe.hasCheese && (
                <span className="inline-flex items-center rounded-md bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 text-xs text-yellow-700 dark:text-yellow-300">
                  {tKebab("cheese")} {tKebab("cheeseYes")}
                </span>
              )}
              {recipe.adds.length > 0 &&
                recipe.adds.map((addon) => (
                  <span
                    key={addon}
                    className="inline-flex items-center rounded-md bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs text-green-700 dark:text-green-300"
                  >
                    {tKebab(`adds.${addon}`)}
                  </span>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
