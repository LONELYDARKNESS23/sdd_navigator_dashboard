"use client";

import { useEffect, useState } from "react";

import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  type ThemeMode,
} from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  function toggleTheme(): void {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      aria-label="Toggle between dark and light theme"
      className="app-button-secondary app-focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      <span aria-hidden="true">Theme</span>
      <span>Toggle</span>
    </button>
  );
}
