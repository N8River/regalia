import { AiOutlineUser } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { PiShoppingCart } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import "./header.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SearchBarDropdown from "../searchBarDropdown/searchBarDropdown";
import { useCart } from "../../context/CartContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSticky, setIsSticky] = useState(false);
  const [dropdownShow, setDropdownShow] = useState(false);

  // const [cartCount, setCartCount] = useState(0);

  const { cartCount } = useCart();
  // console.log(cartCount);

  const navigate = useNavigate();
  const { isMobile } = useResponsive(1024);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setTimeout(() => {
      setMenuVisible(menuOpen);
    }, 1);
  }, [menuOpen]);

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuVisible(false);
      setTimeout(() => {
        setMenuOpen(false);
      }, 300);
    } else {
      setMenuOpen(true);
    }
  };

  // const toggleSearchBarDropdown = () => {
  //   const searchBarDropdown = document.querySelector(".searchBarDropdown");

  //   setSearchBarOpen(!searchBarOpen);

  //   // Toggle the `show` class based on `searchBarOpen` state
  //   if (!searchBarOpen) {
  //     document.body.classList.add("no-scroll"); // Disable scrolling
  //   } else {
  //     document.body.classList.remove("no-scroll"); // Re-enable scrolling
  //   }
  // };

  const toggleSearchBarDropdown = () => {
    setSearchBarOpen(!searchBarOpen);
    if (!searchBarOpen) {
      document.body.classList.add("no-scroll"); // Disable scrolling
    } else {
      document.body.classList.remove("no-scroll"); // Re-enable scrolling
    }
  };

  // const fetchCartCount = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/cart/cart-item-count`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch cart count");
  //     }

  //     const responseData = await response.json();
  //     setCartCount(responseData.itemCount);
  //   } catch (error) {
  //     console.log("Error fetching cart count:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCartCount();
  // }, []);

  useEffect(() => {
    const header = document.querySelector(".header");
    const content = document.querySelector(".content");
    const searchBarDropdown = document.querySelector(".searchBarDropdown");
    const announcementBarHeight =
      document.querySelector(".announcementBar").offsetHeight;
    const headerHeight = header.offsetHeight;

    const stickyPadding = header.offsetHeight;
    // console.log(stickyPadding);

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
        {isMobile && (
          <>
            <div className="hamburgerMenu">
              <button className="menu-toggle" onClick={toggleMenu}>
                <LuMenu />
              </button>
            </div>
            {menuOpen && (
              <div className={`headerMenu ${menuVisible ? "open" : ""}`}>
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
                    <AiOutlineUser /> My Profile
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        <div className="headerLeft">
          <h1 className="headerLogo">Regalia</h1>
        </div>

        {!isMobile && (
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
        )}

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
            {token && cartCount > 0 && (
              <div className="cartCountIndicator">{cartCount}</div>
            )}
          </div>
        </div>
      </div>

      <SearchBarDropdown
        toggleSearchBarDropdown={toggleSearchBarDropdown}
        isVisible={searchBarOpen}
      />
    </>
  );
}

export default Header;
