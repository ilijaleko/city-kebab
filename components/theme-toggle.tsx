"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 sm:h-9 sm:w-9 p-1.5 sm:p-2 touch-manipulation cursor-pointer"
    >
      <div className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
        {mounted ? (
          theme === "dark" ? (
            <Moon className="h-full w-full" />
          ) : (
            <Sun className="h-full w-full" />
          )
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
    </Button>
  );
}
