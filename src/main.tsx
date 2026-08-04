import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { TicketProvider } from "./context/TicketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppToaster from "./components/AppToaster";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TicketProvider>
        <NotificationProvider>
          <App />

          <AppToaster />
        </NotificationProvider>
      </TicketProvider>
    </ThemeProvider>
  </StrictMode>,
);