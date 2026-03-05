"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? (
      <Moon className="h-full w-full" />
    ) : theme === "light" ? (
      <Sun className="h-full w-full" />
    ) : (
      <Monitor className="h-full w-full" />
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-10 w-10 sm:h-9 sm:w-9 p-2 touch-manipulation cursor-pointer"
    >
      <div className="h-5 w-5 sm:h-4 sm:w-4">{icon}</div>
    </Button>
  );
}
