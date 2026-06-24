import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../contexts/usercontext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoggedIn, isAuthLoading } = useUserContext();
    const location = useLocation();

    if (isAuthLoading) {
        return <p>Authentifizierung wird geprüft...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}