"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { ArrowLeft, UserCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HeaderProps = {
  showBack?: boolean;
  backHref?: string;
};

export function Header({ showBack = false, backHref }: HeaderProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const { isSignedIn } = useAuth();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <div className="flex-shrink-0">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="cursor-pointer text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {t("home")}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
        {isSignedIn ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9"
          >
            <Link href={`/${locale}/dashboard`}>
              <UserCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              {t("dashboard")}
            </Link>
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-[10px] sm:text-sm px-1.5 sm:px-3 h-8 sm:h-9"
            >
              {t("signIn")}
            </Button>
          </SignInButton>
        )}
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
