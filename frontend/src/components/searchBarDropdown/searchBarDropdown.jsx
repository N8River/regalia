import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import "./searchBarDropdown.css";

function SearchBarDropdown({ toggleSearchBarDropdown, isVisible }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      toggleSearchBarDropdown(); // Close the search bar after search
      document.body.classList.remove("no-scroll"); // Ensure no-scroll is removed
    }
  };

  useEffect(() => {
    const searchBarDropdown = document.querySelector(".searchBarDropdown");

    if (isVisible) {
      searchBarDropdown.classList.add("show");
    } else {
      searchBarDropdown.classList.remove("show");
    }
  }, [isVisible]);

  return (
    <div className={"searchBarDropdown"}>
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
  );
}

export default SearchBarDropdown;
