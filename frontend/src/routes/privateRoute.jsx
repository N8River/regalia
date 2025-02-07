import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isTokenExpired } from "../context/AuthContext";

const PrivateRoute = ({ element: Component, adminOnly, ...rest }) => {
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!token || !adminOnly) {
        setLoading(false);
        return; // No need to check for admin if adminOnly is false
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-admin`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error verifying admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (adminOnly) {
      checkAdminStatus();
    } else {
      setLoading(false); // For non-admin routes, no admin check is needed
    }
  }, [token, adminOnly]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/account/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};

export default PrivateRoute;
