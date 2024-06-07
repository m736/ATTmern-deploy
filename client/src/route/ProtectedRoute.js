import { Spin } from "antd";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  isAdmin,
  isSiteManager,
  isUser,
}) {
  const { isAuthenticated, authLoading, user } = useSelector(
    (state) => state.authState
  );
  const navigate = useNavigate;
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated) {
    if (
      (isAdmin === true && user.role !== "admin") ||
      (isSiteManager === true && user.role !== "sitemanager") ||
      (isUser === true && user.role !== "user")
    ) {
      return <Navigate to="/cannotaccess" />;
    }
    return children;
  }

  if (authLoading) {
    return <Spin />;
  }
}
