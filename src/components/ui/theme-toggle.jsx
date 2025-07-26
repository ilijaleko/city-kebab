import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-full w-full" />;
      case "dark":
        return <Moon className="h-full w-full" />;
      case "system":
        return <Monitor className="h-full w-full" />;
      default:
        return <Sun className="h-full w-full" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      className="h-10 w-10 sm:h-9 sm:w-9 p-2 touch-manipulation cursor-pointer"
    >
      <div className="h-5 w-5 sm:h-4 sm:w-4">{getIcon()}</div>
    </Button>
  );
}

