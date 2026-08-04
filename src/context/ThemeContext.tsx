import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(
      "supportflow-theme",
    );

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }

    return "system";
  });

  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>("light");

  useEffect(() => {
    const root = document.documentElement;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    function applyTheme() {
      const shouldUseDark =
        theme === "dark" ||
        (theme === "system" && media.matches);

      root.classList.toggle("dark", shouldUseDark);
      setResolvedTheme(shouldUseDark ? "dark" : "light");
    }

    applyTheme();
    localStorage.setItem("supportflow-theme", theme);

    if (theme === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside a ThemeProvider.",
    );
  }

  return context;
}