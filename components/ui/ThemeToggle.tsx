"use client";
import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!mounted) {
    return <div className="w-5 h-5 md:w-6 md:h-6" />; // Placeholder to prevent jump
  }

  return (
    <button
      onClick={toggleTheme}
      // FIX: Removed 'text-white' and 'bg-white/10'.
      // Now it uses 'hover:bg-ebs-crimson' and inherits text color from the Navbar.
      className="p-2 rounded-full hover:bg-ebs-crimson hover:text-white transition-all active:scale-95 border border-transparent"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 md:w-6 md:h-6">
        <Sun 
            className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
            color="currentColor"
        />
        <Moon 
            className={`absolute inset-0 transition-all duration-500 ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
            color="currentColor"
        />
      </div>
    </button>
  );
};