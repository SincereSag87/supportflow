import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function AppToaster() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#f8fafc" : "#0f172a",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
      }}
    />
  );
}
