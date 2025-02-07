import "./signUpForm.css";
import { useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        errorData.errors.forEach((error) => {
          addToast(error.msg, "error");
        });
        throw new Error("Failed to sign up");
      }

      const responseData = await response.json();
      console.log("User created successfully:", responseData.user);
      addToast("Account created successfully!", "success"); // Success toast

      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="signUpForm">
      <h3>SIGN UP</h3>
      <big>Please fill in the information below:</big>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          <big>CREATE ACCOUNT</big>
        </button>
      </form>
      <small>
        Already have an account?{" "}
        <p
          onClick={() => {
            navigate("/account/login");
          }}
        >
          Login
        </p>
      </small>
    </div>
  );
}

export default SignUpForm;
