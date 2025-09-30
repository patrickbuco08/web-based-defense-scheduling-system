import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
    userRoles: string[] | null;
}

export default function ProtectedRoute({ children, allowedRoles, userRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    if (!userRoles) {
        // not logged in → redirect to login
        return <Navigate to="/login" replace />;
    }

    // Redirect admin users to accounts page when accessing root
    if (userRoles.includes('admin') && userRoles.length === 1 && currentPath === '/app') {
        return <Navigate to="/app/admin/accounts" replace />;
    }

    // Redirect coordinator-only users to calendar when accessing root
    const isCoordinatorOnly = userRoles.length === 1 && userRoles.includes('coordinator');

    if (isCoordinatorOnly && (currentPath === '/app' || currentPath === '/app/')) {
        return <Navigate to="/app/coordinators/calendar" replace />;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
    if (!hasRequiredRole) {
        return <Navigate to="/app" replace />;
    }

    return <>{children}</>;
}