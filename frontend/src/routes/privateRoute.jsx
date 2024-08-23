import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, adminOnly, ...rest }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/account/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};

export default PrivateRoute;
