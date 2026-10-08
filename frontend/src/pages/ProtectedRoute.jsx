import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // User is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only page
  if (adminOnly && userRole !== "ADMIN") {
    return <Navigate to="/customer" replace />;
  }

  return children;
}

export default ProtectedRoute;