import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAdmin } from "../context/AdminContext";

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
