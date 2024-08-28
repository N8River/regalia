import { AiOutlineUser } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { PiShoppingCart } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import "./header.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSticky, setIsSticky] = useState(false);
  const [dropdownShow, setDropdownShow] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const toggleSearchBarDropdown = () => {
    const searchBarDropdown = document.querySelector(".searchBarDropdown");

    setSearchBarOpen(!searchBarOpen);

    // Toggle the `show` class based on `searchBarOpen` state
    if (!searchBarOpen) {
      searchBarDropdown.classList.add("show");
      document.body.classList.add("no-scroll"); // Disable scrolling
    } else {
      searchBarDropdown.classList.remove("show");
      document.body.classList.remove("no-scroll"); // Re-enable scrolling
    }
  };

  useEffect(() => {
    const header = document.querySelector(".header");
    const content = document.querySelector(".content");
    const searchBarDropdown = document.querySelector(".searchBarDropdown");
    const announcementBarHeight =
      document.querySelector(".announcementBar").offsetHeight;
    const headerHeight = header.offsetHeight;

    const stickyPadding = header.offsetHeight;
    console.log(stickyPadding);

    const handleScroll = () => {
      if (window.scrollY > announcementBarHeight) {
        // setIsSticky(true);
        header.classList.add("sticky");
        // content.classList.add("sticky-padding");
        content.style.paddingTop = `${stickyPadding}px`;
        searchBarDropdown.classList.add("sticky");
      } else {
        // setIsSticky(false);
        header.classList.remove("sticky");
        // content.classList.remove("sticky-padding");
        content.style.paddingTop = "0";
        searchBarDropdown.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`overlay ${menuOpen || searchBarOpen ? "show" : ""}`}
        onClick={() => {
          if (menuOpen) {
            toggleMenu();
          }
          if (searchBarOpen) {
            toggleSearchBarDropdown();
          }
        }}
      ></div>

      <div className={`header`}>
        {/* Visible on smaller devices */}
        <div className="hamburgerMenu">
          <button className="menu-toggle" onClick={toggleMenu}>
            <LuMenu />
          </button>
        </div>
        <div className={`headerMenu ${menuOpen ? "open" : ""}`}>
          <div className="menu-toggle-container">
            <button className="menu-toggle" onClick={toggleMenu}>
              <IoMdClose />
            </button>
          </div>
          <div className="headerBtn">
            <a href="/">HOME</a>
          </div>
          <div className="headerBtn">
            <a href="/collection/trending">BEST SELLERS</a>
          </div>
          <div className="headerBtn">
            <a href="/collection">SHOP</a>
          </div>
          <div className="headerBtn">
            <a href="">CONTACT</a>
          </div>
          <div className="headerBtn lastChild">
            <a href="/account/">
              <AiOutlineUser />
            </a>
          </div>
        </div>
        {/* Visible on smaller devices */}

        <div className="headerLeft">
          <h1 className="headerLogo">Regalia</h1>
        </div>
        <div className="headerMiddle">
          <div className="headerBtn">
            <a href="/" className="pui">
              HOME
            </a>
          </div>
          <div className="headerBtn">
            <a href="/collection/trending" className="pui">
              BEST SELLERS
            </a>
          </div>
          <div className="headerBtn">
            <a href="/collection" className="pui">
              SHOP
            </a>
          </div>
          <div className="headerBtn">
            <a href="" className="pui">
              CONTACT
            </a>
          </div>
        </div>
        <div className="headerRight">
          <div className="headerBtn">
            <a href="/account/">
              <AiOutlineUser />
            </a>
          </div>
          <div className="headerBtn">
            <div className="searchBtn" onClick={toggleSearchBarDropdown}>
              <IoSearchOutline />
            </div>
          </div>
          <div className="headerBtn">
            <a href="/cart">
              <PiShoppingCart />
            </a>
          </div>
        </div>
      </div>
      <div className="searchBarDropdown">
        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />
          <button type="submit" className="searchButton">
            <IoSearchOutline />
          </button>
        </form>
        <div className="closeSearchBarDropdown">
          <button onClick={toggleSearchBarDropdown}>
            <IoMdClose />
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
