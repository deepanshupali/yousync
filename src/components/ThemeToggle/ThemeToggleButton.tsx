import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoonStar } from "react-icons/lu";
import { MdSunny } from "react-icons/md";

const ThemeToggleButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hidden md:block bg-transparent pr-5 p-2 rounded cursor-pointer transition-colors duration-300"
    >
      {theme === "dark" ? (
        <MdSunny size={24} className="text-yellow-400" />
      ) : (
        <LuMoonStar size={24} className="text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
