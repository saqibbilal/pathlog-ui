import {Navigate, Outlet} from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore.ts";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If not logged in, kick them back to login
  return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
}