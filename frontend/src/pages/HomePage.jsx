import AnnouncementBar from "../components/announcementBar/announcementBar";
import Header from "../components/header/header";
import CollectionList from "../components/collectionList/collectionList";
import FeaturedCollection from "../components/featuredCollection/featuredCollection";
import Features from "../components/features/features";
import Footer from "../components/footer/footer";

function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <CollectionList />
        <FeaturedCollection />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default HomePage;
