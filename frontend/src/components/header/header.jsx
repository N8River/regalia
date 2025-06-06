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
import { AnimatePresence, motion } from "framer-motion";

const MobileHeader = ({
  menuOpen,
  menuVisible,
  toggleSearchBarDropdown,
  toggleMenu,
  cartCount,
  token,
}) => {
  return (
    <>
      <div className="flex w-full flex-1 items-center justify-between sm:px-4">
        <button
          onClick={toggleMenu}
          className="w-1/3 rounded-full p-2 transition-colors hover:bg-neutral-100"
        >
          <LuMenu className="h-6 w-6" />
        </button>
        <h1 className="font-pattaya w-1/3 text-center text-3xl sm:text-4xl">
          Regalia
        </h1>
        <div className="flex w-1/3 items-center justify-end gap-2 sm:gap-4">
          <button
            onClick={toggleSearchBarDropdown}
            className="cursor-pointer transition hover:text-neutral-600"
          >
            <IoSearchOutline className="size-6" />
          </button>
          <a
            href="/cart"
            className="relative rounded-full p-2 transition-colors hover:bg-neutral-100"
          >
            <PiShoppingCart className="h-6 w-6" />
            {token && cartCount > 0 && (
              <div className="bg-primary absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] text-white">
                {cartCount}
              </div>
            )}
          </a>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed top-0 left-0 z-50 h-screen w-[80vw] bg-white shadow-lg shadow-neutral-950/50 sm:w-[40vw]"
          >
            <div className="w-full border-b border-neutral-200 p-4">
              <button
                onClick={toggleMenu}
                className="cursor-pointer rounded-full p-2 transition-colors hover:bg-neutral-100"
              >
                <IoMdClose className="size-6" />
              </button>
            </div>
            <div className="flex flex-col p-6">
              {[
                { label: "HOME", href: "/" },
                { label: "BEST SELLERS", href: "/collection/trending" },
                { label: "SHOP", href: "/collection" },
                {
                  label: "My Profile",
                  href: "/account/",
                  icon: <AiOutlineUser className="size-5 text-neutral-500" />,
                },
              ].map(({ label, href, icon }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="hover:text-primary flex cursor-pointer items-center gap-2 border-b border-neutral-100 py-3 text-base uppercase transition-colors"
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const DesktopHeader = ({ cartCount, token, toggleSearchBarDropdown }) => {
  return (
    <div className="flex w-full items-center justify-between px-8">
      <h1 className="font-pattaya text-4xl">Regalia</h1>
      <div className="flex items-center gap-10">
        <a
          href="/"
          className="text-base font-medium transition hover:text-neutral-600"
        >
          HOME
        </a>
        <a
          href="/collection/trending"
          className="text-base font-medium transition hover:text-neutral-600"
        >
          BEST SELLERS
        </a>
        <a
          href="/collection"
          className="text-base font-medium transition hover:text-neutral-600"
        >
          SHOP
        </a>
      </div>
      <div className="flex items-center gap-8">
        <a href="/account/" className="transition hover:text-neutral-600">
          <AiOutlineUser className="size-6" />
        </a>
        <button
          onClick={toggleSearchBarDropdown}
          className="cursor-pointer transition hover:text-neutral-600"
        >
          <IoSearchOutline className="size-6" />
        </button>
        <a
          href="/cart"
          className="relative cursor-pointer transition hover:text-neutral-600"
        >
          <PiShoppingCart className="size-6" />
          {token && cartCount > 0 && (
            <div className="bg-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] text-white">
              {cartCount}
            </div>
          )}
        </a>
      </div>
    </div>
  );
};

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(1024);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setTimeout(() => {
      setMenuVisible(menuOpen);
    }, 1);
  }, [menuOpen]);

  const toggleMenu = () => {
    // if (menuOpen) {
    //   setMenuVisible(false);
    //   setTimeout(() => {
    //     setMenuOpen(false);
    //   }, 300);
    // } else {
    //   setMenuOpen(true);
    // }
    setMenuOpen(!menuOpen);
  };

  const toggleSearchBarDropdown = () => {
    setSearchBarOpen(!searchBarOpen);
    if (!searchBarOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  useEffect(() => {
    const header = document.querySelector(".header");
    const content = document.querySelector(".content");
    const searchBarDropdown = document.querySelector(".searchBarDropdown");
    const announcementBarHeight =
      document.querySelector(".announcementBar")?.offsetHeight || 0;
    const headerHeight = header?.offsetHeight || 0;
    const stickyPadding = headerHeight;

    const handleScroll = () => {
      if (window.scrollY > announcementBarHeight) {
        header?.classList.add("sticky");
        content.style.paddingTop = `${stickyPadding}px`;
        searchBarDropdown?.classList.add("sticky");
      } else {
        header?.classList.remove("sticky");
        content.style.paddingTop = "0";
        searchBarDropdown?.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          menuOpen || searchBarOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          if (menuOpen) toggleMenu();
          if (searchBarOpen) toggleSearchBarDropdown();
        }}
      />

      <header className="header fixed top-0 left-0 z-30 w-full border-b border-neutral-200 bg-white">
        {isMobile ? (
          <MobileHeader
            menuOpen={menuOpen}
            menuVisible={menuVisible}
            toggleMenu={toggleMenu}
            cartCount={cartCount}
            token={token}
            toggleSearchBarDropdown={toggleSearchBarDropdown}
          />
        ) : (
          <DesktopHeader
            cartCount={cartCount}
            token={token}
            toggleSearchBarDropdown={toggleSearchBarDropdown}
          />
        )}
      </header>

      <SearchBarDropdown
        toggleSearchBarDropdown={toggleSearchBarDropdown}
        isVisible={searchBarOpen}
      />
    </>
  );
}

export default Header;
