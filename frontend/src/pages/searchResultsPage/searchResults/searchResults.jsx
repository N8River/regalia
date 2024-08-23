import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./searchResults.css";
import ProductCard from "../../../components/productCard/productCard";

function SearchResults() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/search?q=${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw Error("Failed to search products");
        }

        const responseData = await response.json();
        console.log(responseData);
        setProducts(responseData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <>
      <div className="searchResultsContainer">
        <h4>Search Results for "{query}"</h4>
        {products.length > 0 ? (
          <div className="searchResults">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <big>No products found</big>
        )}
      </div>
    </>
  );
}

export default SearchResults;
