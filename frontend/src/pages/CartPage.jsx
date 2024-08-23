import Footer from "../components/footer/footer.jsx";
import Header from "../components/header/header.jsx";
import Cart from "../components/cart/cart.jsx";
import AnnouncementBar from "../components/announcementBar/announcementBar.jsx";

function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <Cart />
        <Footer />
      </div>
    </>
  );
}

export default CartPage;
