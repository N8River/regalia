import { useState, useEffect } from "react";
import "./dashboard.css";

function Dashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/total`
        );
        const usersResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/total`
        );
        const productsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/total`
        );
        const revenueResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/revenue/total`
        );
        const recentOrdersResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/recent`
        );

        setTotalOrders(await ordersResponse.json());
        setTotalUsers(await usersResponse.json());
        setTotalProducts(await productsResponse.json());
        setTotalRevenue(await revenueResponse.json());
        setRecentOrders(await recentOrdersResponse.json()); // Set recent orders data
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="dashboard-metrics">
        <div className="dashBoardCard">
          <h4>{totalOrders}</h4>
          <p>Total Orders</p>
        </div>
        <div className="dashBoardCard">
          <h4>{totalUsers}</h4>
          <p>Total Users</p>
        </div>
        <div className="dashBoardCard">
          <h4>{totalProducts}</h4>
          <p>Total Products</p>
        </div>
        <div className="dashBoardCard">
          <h4>₹ {totalRevenue}</h4>
          <p>Total Revenue</p>
        </div>
      </div>
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-5).toUpperCase()}</td>
                <td>
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : "Guest"}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>₹ {order.finalTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
