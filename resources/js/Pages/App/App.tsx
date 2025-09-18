// resources/js/Pages/App/app.tsx
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/providers";
import { AppRoutes } from "./routes"; // Fixed import path

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}
