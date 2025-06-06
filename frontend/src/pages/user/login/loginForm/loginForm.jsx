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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      const responseData = await response.json();
      localStorage.setItem("token", responseData.token);
      navigate("/account");
    } catch (error) {
      console.log("Error loggin in:", error);
      addToast("Failed to log in. Please check your credentials.", "error");
    }
  };

  return (
    <div id="loginForm" className="mx-auto my-16 max-w-md space-y-4 p-6">
      <h2 className="h2">LOGIN</h2>
      <p className="text-center text-sm text-neutral-600">
        Enter your email and password to login:
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="username@email.com"
          name="userEMail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="password"
          name="userPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover w-full cursor-pointer rounded-md py-3 font-medium text-white transition-colors"
        >
          LOGIN
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/account/signup")}
          className="text-primary hover:text-primary-hover cursor-pointer font-medium transition-colors"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
