import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore.ts";

export const GuestRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;

}