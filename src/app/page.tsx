import ThemeToggleButton from "@/components/ThemeToggle/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LuMoonStar } from "react-icons/lu";

export default function Home() {
  return (
    <nav className="flex items-center justify-between p-5 md:p-8">
      <Image
        src="/yousync.png"
        alt="YouSync Logo"
        width={180}
        height={37}
        className="h-9 w-auto md:h-10 md:w-40"
        priority
      />
      <div className="space-x-2 flex items-center">
        <ThemeToggleButton />
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 md:text-lg md:p-5"
          variant="secondary"
        >
          Sign In
        </Button>
        <Button
          className="bg-green-500 text-white hover:bg-green-600 md:text-lg md:p-5"
          variant="secondary"
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
}
