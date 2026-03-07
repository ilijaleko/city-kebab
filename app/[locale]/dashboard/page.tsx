import { auth } from "@clerk/nextjs/server";
import { getTranslations, getLocale } from "next-intl/server";
import { getUserOrderHistory } from "@/lib/queries/orders";
import Link from "next/link";
import { ClipboardList, BookOpen, Settings } from "lucide-react";
import { ADDONS_EMOJIS } from "@/lib/kebab-config";

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
      icon: ClipboardList,
      active: true,
    },
    {
      href: `/${locale}/dashboard/recipes`,
      label: t("recipes"),
      icon: BookOpen,
      active: false,
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: t("settings"),
      icon: Settings,
      active: false,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
          {t("title")}
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              item.active
                ? "bg-stone-900 text-white dark:bg-stone-50 dark:text-stone-900"
                : "bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Order History */}
      <div>
        <h2 className="font-playfair text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3 sm:mb-4">
          {t("history")}
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 py-12 text-center">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 text-stone-300 dark:text-stone-600" />
            <p className="text-sm text-stone-400 dark:text-stone-500">
              {t("noHistory")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-medium text-sm text-stone-900 dark:text-stone-50 truncate">
                    {order.name}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full shrink-0">
                    {order.group.code}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 mb-3">
                  {new Date(order.createdAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="flex flex-wrap gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {tKebab(`types.${order.kebabType}`)}
                  </span>
                  {order.kebabSize && (
                    <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                      {tKebab(`sizes.${order.kebabSize}`)}
                    </span>
                  )}
                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {tKebab(`sauces.${order.sauce}`)}
                  </span>
                  {order.hasCheese && (
                    <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                      {tKebab("cheese")}
                    </span>
                  )}
                  {order.adds.length > 0 &&
                    order.adds.map((addon) => (
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
        )}
      </div>
    </div>
  );
}
