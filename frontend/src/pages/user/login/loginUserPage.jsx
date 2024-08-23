import Features from "../../../components/features/features";
import Footer from "../../../components/footer/footer";
import LogoHeader from "../../../components/logoHeader/logoHeader";
import LoginForm from "./loginForm/loginForm";

function LoginUserPage() {
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
