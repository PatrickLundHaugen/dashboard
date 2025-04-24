import { Button } from "@/components/ui/button.tsx";
import { IoMdSettings } from "react-icons/io";
import { ModeToggle } from "@/components/darkMode/mode-toggle.tsx";

function NavigationBar() {
  return (
    <>
      <nav className="flex items-center justify-end p-4 overflow-hidden">
        <section className="flex gap-2 *:cursor-pointer">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <IoMdSettings />
          </Button>
        </section>
      </nav>
    </>
  );
}

export default NavigationBar;
