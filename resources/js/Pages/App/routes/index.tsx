import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Calendar from "@/Pages/Calendar";
import Room from "@/Pages/Room";
import Account from "@/Pages/Account";
import AdviserGroup from "@/Pages/AdviserGroup";
import Department from "@/Pages/Department";
import DepartmentDefenseCalendar from "@/Pages/Coordinator/DepartmentDefenseCalendar";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Calendar />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="adviser/groups" element={<AdviserGroup />} />

        <Route path="admin/departments" element={<Department />} />
        <Route path="admin/rooms" element={<Room />} />
        <Route path="admin/accounts" element={<Account />} />
        <Route path="coordinators/calendar" element={<DepartmentDefenseCalendar />} />
      </Route>
    </Routes>
  );
}
