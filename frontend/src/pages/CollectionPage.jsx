import Header from "../components/header/header";
import Collections from "../components/collection/collection";
import Features from "../components/features/features";
import Footer from "../components/footer/footer";
import AnnouncementBar from "../components/announcementBar/announcementBar";

function CollectionPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <Collections />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default CollectionPage;
