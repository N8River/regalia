import ProductCard from "../../../components/productCard/productCard";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { MdNavigateBefore } from "react-icons/md";
import { FaFilter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

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
          throw new Error("Failed to fetch products");
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
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [collectionName, location.search]);

  useEffect(() => {
    const collectionToolbar = document.querySelector("#collectionToolbar");
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
    const collectionNameH1Height =
      document.querySelector("#collectionNameH1")?.offsetHeight || 0;
    const announcementBarHeight =
      document.querySelector(".announcementBar")?.offsetHeight || 0;
    const contentPadding = collectionToolbar?.offsetHeight || 0;

    const scrollThreshold = announcementBarHeight + collectionNameH1Height;

    console.log(scrollThreshold);

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        collectionToolbar.style.position = "fixed";
        collectionToolbar.style.top = `${headerHeight}px`;
        document.querySelector(
          "#productCollectionContent"
        ).style.paddingTop = `${contentPadding + 32}px`;
      } else {
        collectionToolbar.style.position = "";
        collectionToolbar.style.top = "";
        document.querySelector("#productCollectionContent").style.paddingTop =
          "";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFilterToolbar = () =>
    setFilterToolbarVisible(!filterToolbarVisible);
  const handleFilterDropdown = (filter) => {
    if (filter === "price") setPriceDropdown(!priceDropdown);
    if (filter === "category") setCategoryDropdown(!categoryDropdown);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleApplyFilter = () => {
    const queryParams = new URLSearchParams();
    queryParams.set("minPrice", priceRangeMin);
    queryParams.set("maxPrice", priceRangeMax);
    queryParams.set("sort", sortOption);
    if (selectedCategories.length > 0) {
      queryParams.set("categories", selectedCategories.join(","));
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    toggleFilterToolbar();
  };

  return (
    <div className="relative min-h-screen">
      <h1 id="collectionNameH1" className="h2 py-10">
        {collectionName}
      </h1>

      <div
        id="collectionToolbar"
        className="bg-white border-t border-b border-neutral-200 py-4 px-6 flex justify-between items-center w-full z-20"
      >
        <div
          id="toolbarNav"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/collection")}
        >
          <MdNavigateBefore className="size-5" />
          <p className="text-sm font-medium">GO BACK</p>
        </div>
        <div
          id="toolbarFilterBtn"
          className="cursor-pointer flex items-center gap-2"
          onClick={toggleFilterToolbar}
        >
          <FaFilter className="size-3 text-neutral-700" />
          <p className="text-sm font-medium uppercase">Filter</p>
        </div>
      </div>

      <div id="productCollectionContent" className="py-8">
        <div
          id="productCollectionContainer"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6"
        >
          {products.map((p, index) => (
            <ProductCard
              key={p._id}
              product={p}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Filter Overlay and Drawer */}
      <AnimatePresence>
        {filterToolbarVisible && (
          <>
            {/* Overlay */}
            <motion.div
              key="filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[1001]"
              onClick={toggleFilterToolbar}
            />

            {/* Drawer */}
            <motion.div
              key="filter-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed right-0 top-0 h-full w-86 bg-white  z-[1002] shadow-xl"
              onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing when clicking inside drawer
            >
              <div className="flex justify-between items-center mb-6 px-6 py-4 border-b border-neutral-200">
                <h4 className="text-lg font-semibold">FILTERS</h4>
                <button
                  onClick={toggleFilterToolbar}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                >
                  <IoCloseOutline className="size-6" />
                </button>
              </div>

              <div className="space-y-6 px-6">
                {/* Price Filter */}
                <div>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleFilterDropdown("price")}
                  >
                    <p className="text-sm font-semibold text-neutral-700">
                      PRICE
                    </p>
                    <IoIosArrowDown
                      className={`w-5 h-5 text-neutral-600 transition-transform duration-300 ${
                        priceDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {priceDropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">$</span>
                              <input
                                type="number"
                                value={priceRangeMin}
                                onChange={(e) =>
                                  setPriceRangeMin(e.target.value)
                                }
                                placeholder="Minimum price"
                                className="w-24 px-2 py-1 border border-neutral-200 rounded text-sm"
                              />
                            </div>
                            <p className="text-sm">to</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">$</span>
                              <input
                                type="number"
                                value={priceRangeMax}
                                onChange={(e) =>
                                  setPriceRangeMax(e.target.value)
                                }
                                placeholder="Maximum price"
                                className="w-24 px-2 py-1 border border-neutral-200 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Sort By</p>
                            <select
                              value={sortOption || ""}
                              onChange={(e) => setSortOption(e.target.value)}
                              className="w-full px-2 py-1 border border-neutral-200 rounded text-sm"
                            >
                              <option value="">Default</option>
                              <option value="price_asc">
                                Price: Low to High
                              </option>
                              <option value="price_desc">
                                Price: High to Low
                              </option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Filter */}
                <div>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleFilterDropdown("category")}
                  >
                    <p className="text-sm font-semibold text-neutral-700">
                      CATEGORY
                    </p>
                    <IoIosArrowDown
                      className={`w-5 h-5 text-neutral-600 transition-transform duration-300 ${
                        categoryDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {categoryDropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-2">
                          {["bracelets", "earrings", "chains", "rings"].map(
                            (category) => (
                              <div
                                key={category}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  id={category}
                                  checked={selectedCategories.includes(
                                    category
                                  )}
                                  onChange={() =>
                                    handleCategoryChange(category)
                                  }
                                  className="w-4 h-4 rounded border-neutral-300"
                                />
                                <label htmlFor={category} className="text-sm">
                                  {category[0].toUpperCase() +
                                    category.slice(1)}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  id="applyFiltersButton"
                  className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors"
                  onClick={handleApplyFilter}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductCollection;
