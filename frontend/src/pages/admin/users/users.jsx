import { useEffect, useState } from "react";
import "./users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  // Fetch overall user stats
  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setTotalUsers(data.totalUsers);
      setActiveUsers(data.activeUsers);
      setInactiveUsers(data.inactiveUsers);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  // Fetch paginated users
  const fetchUsers = async (page) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/users?page=${page}&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages); // Set total pages from backend response
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUserStats(); // Fetch user stats only once when the component mounts
    fetchUsers(page); // Fetch users for the current page
  }, [page]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  // Apply dynamic classes for sorted columns
  const getClassForHeader = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc"
        ? "sorted-column-asc"
        : "sorted-column-desc";
    }
    return "";
  };

  return (
    <div className="users-section">
      <div className="userCardsWrapper">
        <div className="userAdminCard">
          <h4>{totalUsers}</h4> <p>Total Users</p>
        </div>
        <div className="userAdminCard">
          <h4>{activeUsers}</h4> <p>Active Users</p>
        </div>
        <div className="userAdminCard">
          <h4>{inactiveUsers}</h4> <p>Inactive Users</p>
        </div>
      </div>
      <table className="userAdminTable">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("_id")}
              className={getClassForHeader("_id")}
            >
              User ID
            </th>
            <th
              onClick={() => handleSort("firstName")}
              className={getClassForHeader("firstName")}
            >
              Name
            </th>
            <th
              onClick={() => handleSort("email")}
              className={getClassForHeader("email")}
            >
              Email
            </th>
            <th
              onClick={() => handleSort("ordersCount")}
              className={getClassForHeader("ordersCount")}
            >
              Orders
            </th>
            <th
              onClick={() => handleSort("totalSpent")}
              className={getClassForHeader("totalSpent")}
            >
              Total Spent
            </th>
            <th
              onClick={() => handleSort("averageOrderValue")}
              className={getClassForHeader("averageOrderValue")}
            >
              Avg Order Value
            </th>
            <th
              onClick={() => handleSort("lastOrderDate")}
              className={getClassForHeader("lastOrderDate")}
            >
              Last Order Date
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id.slice(-5).toUpperCase()}</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.ordersCount}</td>
              <td>₹{user.totalSpent}</td>
              <td>
                {user.averageOrderValue
                  ? `₹${user.averageOrderValue.toFixed(2)}`
                  : "N/A"}
              </td>
              <td>
                {user.lastOrderDate
                  ? new Date(user.lastOrderDate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="usersAdminPageToolbox">
        <p>
          Page {page} of {totalPages}
        </p>

        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;
