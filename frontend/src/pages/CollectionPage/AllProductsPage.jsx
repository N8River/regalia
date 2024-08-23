import Header from "../../components/header/header";
import Features from "../../components/features/features";
import Footer from "../../components/footer/footer";
import ProductCollection from "./productCollection/productCollection";
import AnnouncementBar from "../../components/announcementBar/announcementBar";
import StickyHeader from "../../components/stickyHeader/stickyHeader";

function AllProductsPage() {
  return (
    <>
      {/* <StickyHeader /> */}
      <AnnouncementBar />
      <Header />
      <div className="content">
        <ProductCollection collectionName={"All Products"} />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default AllProductsPage;
