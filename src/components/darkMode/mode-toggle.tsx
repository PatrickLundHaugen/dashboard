import { IoSunny, IoMoon } from "react-icons/io5";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "@/components/darkMode/theme-provider.tsx";

export function ModeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <IoSunny className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IoMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
