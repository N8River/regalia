import Features from "../../../components/features/features";
import LogoHeader from "../../../components/logoHeader/logoHeader";
import Footer from "../../../components/footer/footer";
import SignUpForm from "./signUpForm/signUpForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isTokenExpired } from "../../../context/AuthContext";

function SignUpPage() {
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
      <SignUpForm />
      <Features />
      <Footer />
    </>
  );
}

export default SignUpPage;
