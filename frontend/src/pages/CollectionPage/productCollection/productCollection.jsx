import { TfiLayoutGrid2 } from "react-icons/tfi";
import { TfiLayoutGrid3 } from "react-icons/tfi";
import ProductCard from "../../../components/productCard/productCard";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdNavigateBefore } from "react-icons/md";

import "./productCollection.css";

function ProductCollection({ collectionName }) {
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const [filterToolbarVisible, setFilterToolbarVisible] = useState(false);
  const [priceDropdown, setPriceDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const [priceRangeMin, setPriceRangeMin] = useState(0);
  const [priceRangeMax, setPriceRangeMax] = useState(10000);
  const [sortOption, setSortOption] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams(location.search);
      const minPrice = queryParams.get("minPrice");
      const maxPrice = queryParams.get("maxPrice");
      const categories = queryParams.get("categories");
      const sort = queryParams.get("sort");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete address");
        }

        const responseData = await response.json();
        let filteredProducts = responseData;

        if (collectionName === "New Arrivals") {
          filteredProducts = responseData.filter(
            (p) => p.status === "new-arrival"
          );
        } else if (collectionName === "Trending") {
          filteredProducts = responseData.filter(
            (p) => p.status === "trending"
          );
        } else if (collectionName === "All Products") {
          filteredProducts = responseData;
        } else {
          filteredProducts = responseData.filter(
            (p) => p.category.toLowerCase() === collectionName.toLowerCase()
          );
        }

        // Apply additional filters from URL query params
        if (minPrice || maxPrice) {
          filteredProducts = filteredProducts.filter((p) => {
            return (
              (!minPrice || p.price >= Number(minPrice)) &&
              (!maxPrice || p.price <= Number(maxPrice))
            );
          });
        }

        if (categories) {
          const categoryList = categories.split(",");
          filteredProducts = filteredProducts.filter((p) =>
            categoryList.includes(p.category.toLowerCase())
          );
        }

        if (sort) {
          filteredProducts.sort((a, b) => {
            if (sort === "price_asc") return a.price - b.price;
            if (sort === "price_desc") return b.price - a.price;
            return 0;
          });
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.log("Error fetching the products:", error);
      }
    };

    fetchProducts();
  }, [collectionName, location.search]);

  useEffect(() => {
    const collectionToolbar = document.querySelector(".collectionToolbar");
    const collectionToolbarHeight =
      document.querySelector(".collectionToolbar").offsetHeight;
    const headerHeight = document.querySelector(".header").offsetHeight;
    // console.log("headerHeight", headerHeight);
    const collectionNameH1Height =
      document.querySelector(".collectionNameH1").offsetHeight;
    // console.log("collectionNameH1Height", collectionNameH1Height);
    const announcementBarHeight =
      document.querySelector(".announcementBar").offsetHeight;
    // console.log("announcementBarHeight", announcementBarHeight);
    const content2 = document.querySelector(".content2");
    const content1 = document.querySelector(".content");
    const productCollectionContainer = document.querySelector(
      ".productCollectionContainer"
    );

    const scrollThreshold =
      headerHeight + collectionNameH1Height - collectionToolbarHeight;

    console.log(scrollThreshold);

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        collectionToolbar.classList.add("sticky");
        productCollectionContainer.classList.add("sticky-padding2");
      } else {
        collectionToolbar.classList.remove("sticky");
        productCollectionContainer.classList.remove("sticky-padding2");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleFilterToolbar = () => {
    setFilterToolbarVisible(!filterToolbarVisible);
  };

  const handleFilterDropdown = (filter) => {
    if (filter === "price") {
      setPriceDropdown(!priceDropdown);
    }

    if (filter === "category") {
      setCategoryDropdown(!categoryDropdown);
    }
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApplyFilter = async () => {
    const queryParams = new URLSearchParams();
    queryParams.set("minPrice", priceRangeMin);
    queryParams.set("maxPrice", priceRangeMax);
    queryParams.set("sort", sortOption);
    if (selectedCategories.length > 0) {
      queryParams.set("categories", selectedCategories.join(","));
    }

    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const handleNavigateBack = () => {
    navigate("/collection");
  };

  return (
    <>
      <div className="productCollection">
        <h1 className="h1ui collectionNameH1">{collectionName}</h1>
        <div className="collectionToolbar">
          <div className="toolbarNav">
            <div onClick={handleNavigateBack}>
              <MdNavigateBefore />
              <p className="pui">GO BACK</p>
            </div>
          </div>
          <div className="toolbarFilterBtn" onClick={toggleFilterToolbar}>
            <div>Filter</div>
          </div>
        </div>

        <div className="productCollectionContainer">
          {products.length > 0
            ? products.map((p) => {
                return <ProductCard key={p._id} product={p} />;
              })
            : ""}
        </div>
      </div>
      {/* Filter Toolbar */}
      <div className={`toolbarFilter ${filterToolbarVisible ? "show" : ""}`}>
        <div className="toolbarFilterHeader">
          <h4>FILTERS</h4>
          <div>
            <button onClick={toggleFilterToolbar}>
              <IoCloseOutline />
            </button>
          </div>
        </div>

        {/* Price Filter */}
        <div className="filterDropdownContainer">
          <div
            className="filterDropdownFilter"
            onClick={() => handleFilterDropdown("price")}
          >
            <p>PRICE</p>
            <div>
              <button>
                <IoIosArrowDown
                  className={`filterDropdownArrow ${
                    priceDropdown ? "show" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          <div className={`filterDropdown ${priceDropdown ? "show" : ""}`}>
            <div className="filterByMaxMinPrice">
              <div class="price-input">
                <span>₹</span>
                <input
                  type="number"
                  value={priceRangeMin}
                  onChange={(e) => setPriceRangeMin(e.target.value)}
                  placeholder="Minimum price"
                />
              </div>

              <p>to</p>
              <div class="price-input">
                <span>₹</span>
                <input
                  type="number"
                  value={priceRangeMax}
                  onChange={(e) => setPriceRangeMax(e.target.value)}
                  placeholder="Maximum price"
                />
              </div>
            </div>

            <div className="filterByPriceSort">
              <p>Sort By</p>
              <select
                value={sortOption || ""}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filterDropdownContainer">
          <div
            className="filterDropdownFilter"
            onClick={() => handleFilterDropdown("category")}
          >
            <p>CATEGORY</p>
            <div>
              <button>
                <IoIosArrowDown
                  className={`filterDropdownArrow ${
                    categoryDropdown ? "show" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          <div className={`filterDropdown ${categoryDropdown ? "show" : ""}`}>
            <div className="categoryFilter">
              <form>
                {["bracelets", "earrings", "chains", "rings"].map(
                  (category) => (
                    <div key={category}>
                      <input
                        type="checkbox"
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <label htmlFor={category}>
                        {category[0].toUpperCase() + category.slice(1)}
                      </label>
                    </div>
                  )
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="applyFiltersContainer">
          <button
            className="applyFiltersButton btn"
            onClick={handleApplyFilter}
          >
            <big>Apply Filters</big>
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductCollection;
