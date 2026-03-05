"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "hr" ? "en" : "hr";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className="cursor-pointer text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 h-8 sm:h-9 min-w-[32px] sm:min-w-[40px]"
    >
      {locale === "hr" ? "EN" : "HR"}
    </Button>
  );
}
