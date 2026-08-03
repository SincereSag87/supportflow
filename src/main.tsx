import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { TicketProvider } from "./context/TicketContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TicketProvider>
      <App />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
          },
        }}
      />
    </TicketProvider>
  </StrictMode>,
);