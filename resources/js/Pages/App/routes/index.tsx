import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Calendar from "@/Pages/Calendar";
import Home from "@/Pages/Home";
import Room from "@/Pages/Room";
import Account from "@/Pages/Account";
import AdviserGroup from "@/Pages/AdviserGroup";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="admin/rooms" element={<Room />} />
        <Route path="admin/accounts" element={<Account />} />
        <Route path="adviser/groups" element={<AdviserGroup />} />
      </Route>
    </Routes>
  );
}
