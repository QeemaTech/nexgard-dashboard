import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LocaleProvider } from "./context/LocaleContext";
import useTranslation from "./hooks/useTranslation";
import "./index.css";

function AppToaster() {
  const { isRtl } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Toaster
      position={isRtl ? "top-left" : "top-right"}
      toastOptions={{
        style: isDark
          ? {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #334155"
            }
          : {
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0"
            }
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <PermissionProvider>
              <AppToaster />
              <App />
            </PermissionProvider>
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
