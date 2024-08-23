import AnnouncementBar from "../components/announcementBar/announcementBar.jsx";
import Footer from "../components/footer/footer.jsx";
import Header from "../components/header/header.jsx";
import Order from "../components/order/order.jsx";

function OrderPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <Order />
        <Footer />
      </div>
    </>
  );
}

export default OrderPage;
