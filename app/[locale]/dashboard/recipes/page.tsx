import { auth } from "@clerk/nextjs/server";
import { getTranslations, getLocale } from "next-intl/server";
import { getUserRecipes } from "@/lib/queries/recipes";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { ClipboardList, BookOpen, Settings } from "lucide-react";
import { RecipeList } from "@/components/recipe-list";

export default async function RecipesPage() {
  const { userId } = await auth();
  const t = await getTranslations("dashboard");
  const tRecipe = await getTranslations("recipe");
  const locale = await getLocale();

  const recipes = await getUserRecipes(userId!);

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t("history"),
      description: t("historyDesc"),
      icon: ClipboardList,
      active: false,
    },
    {
      href: `/${locale}/dashboard/recipes`,
      label: t("recipes"),
      description: t("recipesDesc"),
      icon: BookOpen,
      active: true,
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: t("settings"),
      description: t("settingsDesc"),
      icon: Settings,
      active: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-orange-600">{t("title")}</h1>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-3 gap-3">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card
              className={`transition-colors hover:border-orange-300 cursor-pointer py-4 ${
                item.active
                  ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
                  : ""
              }`}
            >
              <CardContent className="flex flex-col items-center text-center gap-2 px-3">
                <item.icon
                  className={`h-5 w-5 ${
                    item.active
                      ? "text-orange-500"
                      : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    item.active ? "text-orange-600" : ""
                  }`}
                >
                  {item.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recipes Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{tRecipe("myRecipes")}</h2>
        <RecipeList recipes={recipes} />
      </div>
    </div>
  );
}
