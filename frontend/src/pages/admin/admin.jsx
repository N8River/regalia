import { useLocation } from "react-router-dom";
import AdminHeader from "../../components/adminHeader/adminHeader";
import "./admin.css";
import Dashboard from "./dashboard/dashboard";
import Orders from "./orders/orders";
import Users from "./users/users";
import Products from "./products/products";

function adminPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const section = queryParams.get("section") || "dashboard"; // Default to 'dashboard'

  // Render the correct section based on the query param
  const renderSection = () => {
    switch (section) {
      case "orders":
        return <Orders />;
      case "users":
        return <Users />;
      case "products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="adminSectionWrapper">{renderSection()}</div>
    </>
  );
}

export default adminPage;
