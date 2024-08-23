import { useEffect } from "react";
import Header from "../../components/header/header";
import AnnouncementBar from "../../components/announcementBar/announcementBar";

function StickyHeader() {
  useEffect(() => {
    const header = document.querySelector(".header");
    const announcementBarHeight =
      document.querySelector(".announcementBar").offsetHeight;
    const content = document.querySelector(".content"); // Adjust this selector to target your content wrapper

    const handleScroll = () => {
      if (window.scrollY > announcementBarHeight) {
        header.classList.add("sticky");
        content.classList.add("sticky-padding");
      } else {
        header.classList.remove("sticky");
        content.classList.remove("sticky-padding");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <AnnouncementBar />
      <Header />
    </>
  );
}

export default StickyHeader;
