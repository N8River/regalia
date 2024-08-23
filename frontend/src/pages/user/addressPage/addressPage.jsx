import AddressManager from "../../../components/addressManager/addressManager";
import AnnouncementBar from "../../../components/announcementBar/announcementBar";
import Features from "../../../components/features/features";
import Footer from "../../../components/footer/footer";
import Header from "../../../components/header/header";

function AddressPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <AddressManager />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default AddressPage;
