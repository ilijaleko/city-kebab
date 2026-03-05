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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-md px-4 py-6 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">{t("notFound")}</h1>
            <p className="text-muted-foreground">{t("notFoundDesc")}</p>
            <div className="flex gap-2 justify-center">
              <a href={`/${locale}`}>
                <span className="inline-flex items-center justify-center rounded-md bg-orange-500 hover:bg-orange-600 text-white h-9 px-4 py-2 text-sm font-medium cursor-pointer">
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
      orders={orders}
      locale={locale}
      userId={userId}
    />
  );
}
