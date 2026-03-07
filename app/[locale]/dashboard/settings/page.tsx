"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";
import { ClipboardList, BookOpen, Settings } from "lucide-react";

const LOCAL_STORAGE_KEY = "city-kebab-default-name";

export default function SettingsPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  const storedName = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(LOCAL_STORAGE_KEY) ?? "",
    () => "",
  );

  const [defaultName, setDefaultName] = useState(storedName);

  function handleSave() {
    localStorage.setItem(LOCAL_STORAGE_KEY, defaultName);
    toast.success(t("settingsSaved"));
  }

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
      active: false,
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: t("settings"),
      description: t("settingsDesc"),
      icon: Settings,
      active: true,
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

      {/* Settings Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-3">{t("settings")}</h2>

        {/* Default Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("defaultName")}</CardTitle>
            <CardDescription>{t("defaultNameDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={defaultName}
                onChange={(e) => setDefaultName(e.target.value)}
                placeholder=""
                className="flex-1"
              />
              <Button
                onClick={handleSave}
                className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900"
              >
                {tCommon("save")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Preference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("preferredLanguage")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
