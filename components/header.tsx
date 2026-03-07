"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton, useAuth, useClerk, useUser } from "@clerk/nextjs";
import { ArrowLeft, ChevronDown, LogOut, UserCircle } from "lucide-react";
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
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

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
        <LanguageSwitcher />
        <ThemeToggle />
        {!isLoaded ? (
          <div className="w-[70px] sm:w-[85px] h-8 sm:h-9 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse" />
        ) : isSignedIn ? (
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9 rounded-r-none border-r-0"
            >
              <Link href={`/${locale}/dashboard`}>
                <UserCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                {t("dashboard")}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer h-8 sm:h-9 px-1.5 rounded-l-none"
                >
                  <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium truncate">
                    {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                  </p>
                  {user?.fullName && user?.emailAddresses[0]?.emailAddress && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {user.emailAddresses[0].emailAddress}
                    </p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ redirectUrl: `/${locale}` })}
                  className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
      </div>
    </div>
  );
}
