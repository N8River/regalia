import Features from "../../components/features/features";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import SearchResults from "./searchResults/searchResults";
import AnnouncementBar from "../../components/announcementBar/announcementBar";

function SearchResultsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <SearchResults />
        <Features />
        <Footer />
      </div>
    </>
  );
}

export default SearchResultsPage;
