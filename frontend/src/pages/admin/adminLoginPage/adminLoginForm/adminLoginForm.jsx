import "./adminLoginForm.css";
import { useState } from "react";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to log in as ADMIN");
    }

    const responseData = await response.json();

    localStorage.setItem("token", responseData.token);

    const decodedToken = JSON.parse(atob(responseData.token.split(".")[1]));
    localStorage.setItem("isAdmin", decodedToken.isAdmin);
    console.log("Admin logged in successfully:", responseData);
  };

  return (
    <div className="adminLoginForm">
      <form method="POST" onSubmit={handleSubmit}>
        <h1>Enter the info below:</h1>
        <input
          type="email"
          placeholder="ADMIN EMAIL"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <input
          type="password"
          placeholder="ADMIN PASSWORD"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />

        <button type="submit">LOGIN AS ADMIN</button>
      </form>
    </div>
  );
}

export default AdminLoginForm;
