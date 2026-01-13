import { Navigate } from "react-router-dom";
import { Fragment, ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // ⏳ Wait until auth check is done (VERY important)
  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  // 🔒 Not authenticated → redirect
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // ✅ Authenticated → allow access
  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
