import * as React from "react";

import { createRoot } from "react-dom/client";
// import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/providers";
import { AppRoutes } from "./routes";
import { App } from "./App";

// Get the root element
const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
