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
        },
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
      addToast("Account created successfully!", "success");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div id="signUpForm" className="mx-auto my-16 max-w-md space-y-4 p-6">
      <h2 className="h2">SIGN UP</h2>
      <p className="text-center text-sm text-neutral-600">
        Please fill in the information below:
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
        />
        <input
          type="email"
          placeholder="username@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover w-full cursor-pointer rounded-md py-3 font-medium text-white transition-colors"
        >
          CREATE ACCOUNT
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/account/login")}
          className="text-primary hover:text-primary-hover cursor-pointer font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default SignUpForm;
