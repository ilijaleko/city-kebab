import { auth } from "@clerk/nextjs/server";
import { getTranslations, getLocale } from "next-intl/server";
import { getUserOrderHistory } from "@/lib/queries/orders";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { ClipboardList, BookOpen, Settings } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  const t = await getTranslations("dashboard");
  const tKebab = await getTranslations("kebab");
  const locale = await getLocale();

  const { orders } = await getUserOrderHistory(userId!);

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t("history"),
      description: t("historyDesc"),
      icon: ClipboardList,
      active: true,
    },
    {
      href: `/${locale}/dashboard/recipes`,
      label: t("recipes"),
      description: t("recipesDesc"),
      icon: BookOpen,
      active: false,
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
              className={`transition-colors hover:border-stone-300 cursor-pointer py-4 ${
                item.active
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                  : ""
              }`}
            >
              <CardContent className="flex flex-col items-center text-center gap-2 px-3">
                <item.icon
                  className={`h-5 w-5 ${
                    item.active ? "text-orange-500" : "text-muted-foreground"
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

      {/* Order History Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t("history")}</h2>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>{t("noHistory")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.name}</CardTitle>
                    <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/30 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-300">
                      {order.group.code}
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs">
                      {tKebab(`types.${order.kebabType}`)}
                    </span>
                    {order.kebabSize && (
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs">
                        {tKebab(`sizes.${order.kebabSize}`)}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs">
                      {tKebab(`sauces.${order.sauce}`)}
                    </span>
                    {order.hasCheese && (
                      <span className="inline-flex items-center rounded-md bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 text-xs text-yellow-700 dark:text-yellow-300">
                        {tKebab("cheese")} {tKebab("cheeseYes")}
                      </span>
                    )}
                    {order.adds.length > 0 &&
                      order.adds.map((addon) => (
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
        )}
      </div>
    </div>
  );
}
