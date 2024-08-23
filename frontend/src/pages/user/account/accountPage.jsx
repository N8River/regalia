import Features from "../../../components/features/features";
import Footer from "../../../components/footer/footer";
import Header from "../../../components/header/header";

import Account from "../../../components/account/account";
import AnnouncementBar from "../../../components/announcementBar/announcementBar";

function AccountPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <Account />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default AccountPage;
