import AnnouncementBar from "../components/announcementBar/announcementBar";
import Header from "../components/header/header";
import CollectionList from "../components/collectionList/collectionList";
import FeaturedCollection from "../components/featuredCollection/featuredCollection";
import Features from "../components/features/features";
import Footer from "../components/footer/footer";
import Hero from "../components/hero/hero";
function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <CollectionList />
        <Hero />
        <FeaturedCollection />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default HomePage;
