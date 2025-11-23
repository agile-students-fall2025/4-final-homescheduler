import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in → send user back to login page
    return <Navigate to="/" replace />;
  }

  // Logged in → allow page to load
  return children;
}
