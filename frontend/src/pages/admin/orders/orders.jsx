import { useEffect, useState } from "react";
import "./orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchOrders = async (page, status) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/orders?page=${page}&limit=10&status=${status || ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(page, statusFilter);
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      fetchOrders(page, statusFilter); // Refresh orders after status change
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedOrders = [...orders].sort((a, b) => {
      if (key === "user") {
        const nameA = `${a.user?.firstName || ""} ${a.user?.lastName || ""}`;
        const nameB = `${b.user?.firstName || ""} ${b.user?.lastName || ""}`;
        if (nameA < nameB) return direction === "asc" ? -1 : 1;
        if (nameA > nameB) return direction === "asc" ? 1 : -1;
        return 0;
      } else {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setOrders(sortedOrders);
  };

  const getClassForHeader = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc"
        ? "sorted-column-asc"
        : "sorted-column-desc";
    }
    return "";
  };

  return (
    <>
      <select
        className="ordersSelectAdmin"
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Completed">Completed</option>
      </select>
      <table className="ordersAdminTable">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("_id")}
              className={getClassForHeader("_id")}
            >
              Order ID
            </th>
            <th
              onClick={() => handleSort("user")}
              className={getClassForHeader("user")}
            >
              User
            </th>
            <th
              onClick={() => handleSort("createdAt")}
              className={getClassForHeader("createdAt")}
            >
              Date
            </th>
            <th
              onClick={() => handleSort("status")}
              className={getClassForHeader("status")}
            >
              Status
            </th>
            <th
              onClick={() => handleSort("finalTotal")}
              className={getClassForHeader("finalTotal")}
            >
              Total
            </th>
            <th className="actionsTable">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-5).toUpperCase()}</td>
              <td>
                {order.user?.firstName} {order.user?.lastName}
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>₹ {order.finalTotal}</td>
              <td className="actionsTable">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ordersAdminPageToolbox">
        <p>
          Page {page} of {totalPages}
        </p>

        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={`${page === totalPages ? "disabled" : ""}`}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Orders;
