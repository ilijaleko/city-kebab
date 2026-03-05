import { auth } from "@clerk/nextjs/server";
import { getGroupByCode } from "@/lib/queries/groups";
import { getTranslations } from "next-intl/server";
import { GroupPageClient } from "./group-page-client";

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export default async function GroupPage({ params }: Props) {
  const { locale, code } = await params;
  const t = await getTranslations("group");
  const { userId } = await auth();

  const group = await getGroupByCode(code);

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-stone-950 dark:to-stone-900">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-300/30 dark:bg-orange-900/20 blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-orange-200/25 dark:bg-orange-900/15 blur-3xl" />
        </div>
        <div className="relative container mx-auto max-w-md px-4 py-6 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-2">🥙</div>
            <h1 className="font-playfair text-2xl font-bold text-stone-900 dark:text-amber-50">
              {t("notFound")}
            </h1>
            <p className="text-sm text-stone-500 dark:text-amber-300/50">
              {t("notFoundDesc")}
            </p>
            <div className="flex gap-2 justify-center">
              <a href={`/${locale}`}>
                <span className="inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white h-10 px-5 py-2 text-sm font-medium cursor-pointer shadow-md">
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
  }));

  return (
    <GroupPageClient
      groupCode={group.code}
      groupCreatorId={group.creatorId}
      orders={orders}
      locale={locale}
      userId={userId}
    />
  );
}
