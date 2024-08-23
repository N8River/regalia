import Features from "../components/features/features";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import Checkout from "../components/checkout/checkout";
import AnnouncementBar from "../components/announcementBar/announcementBar";

function CheckoutPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <Checkout />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default CheckoutPage;
