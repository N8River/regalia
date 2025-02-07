import "./loginForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const addToast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
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
        throw new Error("Failed to log in");
      }

      const responseData = await response.json();

      localStorage.setItem("token", responseData.token);

      // const decodedToken = JSON.parse(atob(responseData.token.split(".")[1]));
      // localStorage.setItem("isAdmin", decodedToken.isAdmin);

      // console.log("User logged in successfully:", responseData);

      // addToast("User logged in successfully!", "success");

      navigate("/account");
    } catch (error) {
      console.log("Error loggin in:", error);
      addToast("Failed to log in. Please check your credentials.", "error");
    }
  };

  return (
    <div className="loginForm">
      <h3>LOGIN</h3>
      <big>Enter your email and password to login:</big>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="e-mail address"
          name="userEMail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          name="userPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">
          <big className="bigui">LOGIN</big>
        </button>
      </form>
      <small>
        Don't have an account?{" "}
        <p
          onClick={() => {
            navigate("/account/signup");
          }}
        >
          Sign Up
        </p>
      </small>
    </div>
  );
}

export default LoginForm;
