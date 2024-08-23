import Features from "../../../components/features/features";
import LogoHeader from "../../../components/logoHeader/logoHeader";
import Footer from "../../../components/footer/footer";
import SignUpForm from "./signUpForm/signUpForm";

function SignUpPage() {
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
