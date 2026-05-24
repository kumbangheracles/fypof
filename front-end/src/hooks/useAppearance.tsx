import { useEffect, useState } from "react";

export type Appearance = "light" | "dark" | "system";

const prefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const applyTheme = (appearance: Appearance) => {
  const isDark =
    appearance === "dark" || (appearance === "system" && prefersDark());
  document.documentElement.classList.toggle("dark", isDark);
};

const getMediaQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

export function initializeTheme() {
  const savedAppearance =
    (localStorage.getItem("appearance") as Appearance) || "system";
  applyTheme(savedAppearance);
  getMediaQuery().addEventListener("change", handleSystemThemeChange);
}

const handleSystemThemeChange = () => {
  const currentAppearance = localStorage.getItem("appearance") as Appearance;
  applyTheme(currentAppearance || "system");
};

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>("system");

  const updateAppearance = (mode: Appearance) => {
    setAppearance(mode);
    localStorage.setItem("appearance", mode);
    applyTheme(mode);
  };

  useEffect(() => {
    const saved = localStorage.getItem("appearance") as Appearance | null;
    updateAppearance(saved || "system");

    const mq = getMediaQuery();
    mq.addEventListener("change", handleSystemThemeChange);
    return () => mq.removeEventListener("change", handleSystemThemeChange);
  }, []);

  return { appearance, updateAppearance };
}
