import Header from "../../components/header/header";
import Features from "../../components/features/features";
import Footer from "../../components/footer/footer";
import ProductCollection from "./productCollection/productCollection";
import AnnouncementBar from "../../components/announcementBar/announcementBar";

function BraceletsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <ProductCollection collectionName={"Bracelets"} />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default BraceletsPage;
