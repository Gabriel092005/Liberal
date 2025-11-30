import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="relative border-none dark:bg-black"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-all dark:opacity-0 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all opacity-0 scale-0 dark:opacity-100 dark:scale-100 text-blue-300" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
