"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogOut } from "lucide-react";
import { saveDefaultName } from "@/lib/actions/profile";

type SettingsFormProps = {
  defaultName: string;
  locale: string;
};

export function SettingsForm({
  defaultName: initialName,
  locale,
}: SettingsFormProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const { signOut } = useClerk();
  const [defaultName, setDefaultName] = useState(initialName);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await saveDefaultName(defaultName);
        toast.success(t("settingsSaved"));
      } catch {
        toast.error("Failed to save");
      }
    });
  }

  return (
    <>
      {/* Settings */}
      <div className="space-y-4">
        <h2 className="font-playfair text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3 sm:mb-4">
          {t("settings")}
        </h2>

        {/* Default Name */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
            {t("defaultName")}
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 mb-3">
            {t("defaultNameDesc")}
          </p>
          <div className="flex gap-3">
            <Input
              value={defaultName}
              onChange={(e) => setDefaultName(e.target.value)}
              placeholder=""
              className="flex-1 rounded-lg"
            />
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 rounded-lg shadow-sm"
            >
              {isPending ? tCommon("loading") : tCommon("save")}
            </Button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-50 mb-3">
            {t("preferredLanguage")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Sign Out */}
      <div className="pt-2">
        <button
          onClick={() => signOut({ redirectUrl: `/${locale}` })}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {tCommon("signOut")}
        </button>
      </div>
    </>
  );
}
