import { useLocation, useNavigate } from "react-router-dom";
import "./adminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (section) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("section", section);
    navigate(`/admin?${queryParams.toString()}`);
  };

  const queryParams = new URLSearchParams(location.search);
  const activeSection = queryParams.get("section") || "dashboard"; // Default to 'dashboard'

  return (
    <header className="adminHeader">
      <div
        className={`adminHeaderBtn ${
          activeSection === "dashboard" ? "active" : ""
        }`}
        onClick={() => handleNavigation("dashboard")}
      >
        Dashboard
      </div>
      <div
        className={`adminHeaderBtn ${
          activeSection === "orders" ? "active" : ""
        }`}
        onClick={() => handleNavigation("orders")}
      >
        Orders
      </div>
      <div
        className={`adminHeaderBtn ${
          activeSection === "users" ? "active" : ""
        }`}
        onClick={() => handleNavigation("users")}
      >
        Users
      </div>
      <div
        className={`adminHeaderBtn ${
          activeSection === "products" ? "active" : ""
        }`}
        onClick={() => handleNavigation("products")}
      >
        Products
      </div>
      <div
        className="adminHeaderBtn"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Sign Out
      </div>
    </header>
  );
}

export default AdminHeader;
