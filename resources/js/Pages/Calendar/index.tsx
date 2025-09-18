import { createRoot } from "react-dom/client";
import React from "react";
import Calendar from "./Calendar";

// Get the root element
const container = document.getElementById("calendar");
const root = createRoot(container);

// Render the TestReact component
root.render(
  <React.StrictMode>
    <Calendar />
  </React.StrictMode>
);
