import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Calendar from "@/Pages/Calendar";
import Room from "@/Pages/Room";
import Account from "@/Pages/Account";
import AdviserGroup from "@/Pages/AdviserGroup";
import Department from "@/Pages/Department";
import DepartmentDefenseCalendar from "@/Pages/Coordinator/DepartmentDefenseCalendar";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

export function AppRoutes() {

  const { user, loading } = useAuth();

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>

        <Route
          index
          element={
            <ProtectedRoute
              allowedRoles={['coordinator', 'adviser', 'panelist', 'critic']}
              userRoles={user?.roles}
              children={<Calendar />}
            />
          }
        />


        <Route path="admin/departments" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Department />} />} />
        <Route path="admin/rooms" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Room />} />} />
        <Route path="admin/accounts" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Account />} />} />

        <Route path="adviser/groups" element={<ProtectedRoute allowedRoles={['adviser']} userRoles={user?.roles} children={<AdviserGroup />} />} />

        <Route path="coordinators/calendar" element={<ProtectedRoute allowedRoles={['coordinator']} userRoles={user?.roles} children={<DepartmentDefenseCalendar />} />} />
      </Route>
    </Routes>
  );
}
