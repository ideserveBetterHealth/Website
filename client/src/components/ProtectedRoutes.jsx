import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (adminOnly && user.role !== "admin") {
        navigate("/dashboard");
      } else if (
        adminOnly &&
        user.role == "admin" &&
        user.isVerified !== "verified"
      ) {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate, adminOnly]);

  if (isLoading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Loader className="w-[15%] h-[15%] animate-spin text-[#fdce4d]" />
      </div>
    );
  }

  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // Show loader while checking authentication status
  if (isLoading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Loader className="w-[15%] h-[15%] animate-spin text-[#fdce4d]" />
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise show the login page
  return children;
};
