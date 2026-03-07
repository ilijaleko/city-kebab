import { auth } from "@clerk/nextjs/server";
import { getTranslations, getLocale } from "next-intl/server";
import { getUserDefaultName } from "@/lib/queries/profile";
import Link from "next/link";
import { ClipboardList, BookOpen, Settings } from "lucide-react";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const { userId } = await auth();
  const t = await getTranslations("dashboard");
  const locale = await getLocale();

  const defaultName = await getUserDefaultName(userId!);

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t("history"),
      icon: ClipboardList,
      active: false,
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
      active: true,
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

      {/* Settings */}
      <SettingsForm defaultName={defaultName} locale={locale} />
    </div>
  );
}
