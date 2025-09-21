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

    if (userRoles.includes('admin') && currentPath === '/app') {
        return <Navigate to="/app/admin/accounts" replace />;
    } else {
        const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
        if (!hasRequiredRole) {
            // logged in but not allowed → redirect somewhere else
            return <Navigate to="/app" replace />;
        }
    }



    return <>{children}</>;
}