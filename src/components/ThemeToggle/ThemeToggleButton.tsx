"use client";

import { useEffect, useState } from "react";
import { LuMoonStar } from "react-icons/lu";
import { MdSunny } from "react-icons/md";

const ThemeToggleButton: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme state from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const darkMode = storedTheme === "dark";
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  const toggleTheme = (): void => {
    const newTheme = !isDark;
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
    setIsDark(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="hidden md:block bg-transparent pr-5 p-2 rounded cursor-pointer transition-colors duration-300"
    >
      {isDark ? (
        <MdSunny size={24} className="text-yellow-400" />
      ) : (
        <LuMoonStar size={24} className="text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
