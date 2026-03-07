"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="h-8 w-8 sm:h-9 sm:w-9 p-1.5 sm:p-2 touch-manipulation cursor-pointer"
    >
      <Sun className="h-4 w-4 sm:h-[18px] sm:w-[18px] dark:hidden" />
      <Moon className="h-4 w-4 sm:h-[18px] sm:w-[18px] hidden dark:block" />
    </Button>
  );
}
