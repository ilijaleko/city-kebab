"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

type HeaderProps = {
  showBack?: boolean;
  backHref?: string;
};

export function Header({ showBack = false, backHref }: HeaderProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("home")}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="cursor-pointer">
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
