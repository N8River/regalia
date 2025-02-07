import Footer from "../components/footer/footer.jsx";
import Header from "../components/header/header.jsx";
import Cart from "../components/cart/cart.jsx";
import AnnouncementBar from "../components/announcementBar/announcementBar.jsx";
import Features from "../components/features/features.jsx";

function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <Cart />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default CartPage;
