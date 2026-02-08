import React from "react";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import Account from "@/Pages/Account";
import AdviserGroup from "@/Pages/AdviserGroup";
import Calendar from "@/Pages/Calendar";
import Dashboard from "@/Pages/Dashboard";
import DepartmentDefenseCalendar from "@/Pages/Coordinator/DepartmentDefenseCalendar";
import Department from "@/Pages/Department";
import Term from "@/Pages/Term";
import Room from "@/Pages/Room";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminReport from "@/Pages/AdminReport";
import CoordinatorReport from "@/Pages/CoordinatorReport";
import AdminLog from "@/Pages/AdminLog";
import CoordinatorLog from "@/Pages/CoordinatorLog";

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

        <Route
          path="dashboard"
          element={
            <ProtectedRoute
              allowedRoles={['coordinator', 'adviser', 'panelist', 'critic']}
              userRoles={user?.roles}
              children={<Dashboard />}
            />
          }
        />


        <Route path="admin/departments" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Department />} />} />
        <Route path="admin/rooms" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Room />} />} />
        <Route path="admin/accounts" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Account />} />} />
        <Route path="admin/terms" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<Term />} />} />
        <Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<AdminReport />} />} />
        <Route path="admin/logs" element={<ProtectedRoute allowedRoles={['admin']} userRoles={user?.roles} children={<AdminLog />} />} />

        <Route path="adviser/groups" element={<ProtectedRoute allowedRoles={['adviser']} userRoles={user?.roles} children={<AdviserGroup />} />} />

        <Route path="coordinators/calendar" element={<ProtectedRoute allowedRoles={['coordinator']} userRoles={user?.roles} children={<DepartmentDefenseCalendar />} />} />
        <Route path="coordinators/reports" element={<ProtectedRoute allowedRoles={['coordinator']} userRoles={user?.roles} children={<CoordinatorReport />} />} />
        <Route path="coordinators/logs" element={<ProtectedRoute allowedRoles={['coordinator']} userRoles={user?.roles} children={<CoordinatorLog />} />} />
      </Route>
    </Routes>
  );
}
