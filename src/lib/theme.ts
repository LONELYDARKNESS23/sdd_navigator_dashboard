export type ThemeMode = "dark" | "light";

export const THEME_STORAGE_KEY = "sdd-navigator-theme";
export const DEFAULT_THEME: ThemeMode = "dark";

export function normalizeTheme(value: string | null | undefined): ThemeMode {
  return value === "light" ? "light" : DEFAULT_THEME;
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
}

export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  const body = document.body;

  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  if (body) {
    body.classList.remove("dark", "light");
    body.classList.add(theme);
    body.dataset.theme = theme;
  }
}

export function persistTheme(theme: ThemeMode): void {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getThemeInitScript(): string {
  const storageKey = JSON.stringify(THEME_STORAGE_KEY);
  const defaultTheme = JSON.stringify(DEFAULT_THEME);

  return `(() => {
    try {
      const theme = localStorage.getItem(${storageKey}) === "light" ? "light" : ${defaultTheme};
      const root = document.documentElement;
      const body = document.body;

      root.classList.remove("dark", "light");
      root.classList.add(theme);
      root.dataset.theme = theme;
      root.style.colorScheme = theme;

      if (body) {
        body.classList.remove("dark", "light");
        body.classList.add(theme);
        body.dataset.theme = theme;
      }
    } catch (error) {
      const root = document.documentElement;
      root.classList.add(${defaultTheme});
      root.dataset.theme = ${defaultTheme};
      root.style.colorScheme = ${defaultTheme};
    }
  })();`;
}
