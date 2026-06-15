"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { getInitialTheme, applyTheme } from "@/utils";
import { THEME_STORAGE_KEY } from "@/constants";
import { Theme } from "@/types";

export const ThemeToggle: FC = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
};
