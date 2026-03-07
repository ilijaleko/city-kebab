import { getGroupByCode } from "@/lib/queries/groups";
import { getPriceMap } from "@/lib/queries/prices";
import { getUserDefaultName } from "@/lib/queries/profile";
import { getUserRecipes } from "@/lib/queries/recipes";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { GroupPageClient } from "./group-page-client";

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export default async function GroupPage({ params }: Props) {
  const { locale, code } = await params;

  const [t, { userId }, group, prices] = await Promise.all([
    getTranslations("group"),
    auth(),
    getGroupByCode(code),
    getPriceMap(),
  ]);

  if (!group) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="container mx-auto max-w-md px-4 py-6 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-2">🥙</div>
            <h1 className="font-playfair text-2xl font-bold text-stone-900 dark:text-stone-50">
              {t("notFound")}
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t("notFoundDesc")}
            </p>
            <div className="flex gap-2 justify-center">
              <a href={`/${locale}`}>
                <span className="inline-flex items-center justify-center rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white h-10 px-5 py-2 text-sm font-medium cursor-pointer shadow-sm">
                  {t("goHome")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orders = group.orders.map((order) => ({
    id: order.id,
    name: order.name,
    kebabType: order.kebabType,
    kebabSize: order.kebabSize,
    sauce: order.sauce,
    hasCheese: order.hasCheese,
    adds: order.adds,
    userId: order.userId,
    price: order.price,
  }));

  const [recipes, defaultName] = userId
    ? await Promise.all([getUserRecipes(userId), getUserDefaultName(userId)])
    : [[], ""];

  return (
    <GroupPageClient
      groupCode={group.code}
      groupCreatorId={group.creatorId}
      orders={orders}
      locale={locale}
      userId={userId}
      recipes={recipes}
      defaultName={defaultName}
      prices={prices}
    />
  );
}
