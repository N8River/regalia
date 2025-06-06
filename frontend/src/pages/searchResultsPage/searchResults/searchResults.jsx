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
          },
        );

        if (!response.ok) {
          throw Error("Failed to search products");
        }

        const responseData = await response.json();
        setProducts(responseData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="relative min-h-screen">
      <h1 className="h2 py-10">Search Results for "{query}"</h1>

      <div id="searchResultsContent" className="py-8">
        <div className="grid grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-lg text-neutral-600">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
