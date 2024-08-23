import Header from "../../components/header/header";
import Features from "../../components/features/features";
import Footer from "../../components/footer/footer";
import ProductCollection from "./productCollection/productCollection";
import AnnouncementBar from "../../components/announcementBar/announcementBar";

function TrendingPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <ProductCollection collectionName={"Trending"} />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default TrendingPage;
