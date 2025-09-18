import { createRoot } from "react-dom/client";
// import { StrictMode } from "react";
import * as React from "react";
import Calendar from "./Calendar.jsx";
import Layout from "../../layouts/AppLayout.tsx";

function App() {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-muted-foreground">This is your main content area.</p>
      </div>
    </Layout>
  );
}

// Get the root element
const container = document.getElementById("calendar");
const root = createRoot(container);

// Render the TestReact component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
