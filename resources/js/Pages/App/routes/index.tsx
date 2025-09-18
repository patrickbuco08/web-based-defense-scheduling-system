// resources/js/Pages/App/routes/index.tsx
import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Calendar from "@/Pages/Calendar";
import Home from "@/Pages/Home";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>
    </Routes>
  );
}
