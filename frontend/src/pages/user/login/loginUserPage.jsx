import Features from "../../../components/features/features";
import Footer from "../../../components/footer/footer";
import LogoHeader from "../../../components/logoHeader/logoHeader";
import LoginForm from "./loginForm/loginForm";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../../context/AuthContext";
import { useEffect } from "react";

function LoginUserPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      navigate("/account");
    }
  }, [token, navigate]);

  return (
    <>
      <LogoHeader />
      <LoginForm />
      <Features />
      <Footer />
    </>
  );
}

export default LoginUserPage;
