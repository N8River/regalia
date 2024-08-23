import { useEffect, useState } from "react";
import ProductCard from "../productCard/productCard";
import "./featuredCollection.css";

function FeaturedCollection() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const newArrivalsProducts = data.filter((p) => {
          return p.status === "new-arrival";
        });
        return newArrivalsProducts;
      })
      .then((data) => setNewArrivals(data));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const trendingProducts = data.filter((p) => {
          return p.status === "trending";
        });
        return trendingProducts;
      })
      .then((data) => setTrending(data));
  }, []);

  return (
    <div className="featuredCollection">
      <div className="newArrivals">
        <h2 className="h2ui">NEW ARRIVALS</h2>
        <div className="productListContainer">
          {newArrivals.length > 0
            ? newArrivals.map((p) => {
                return <ProductCard product={p} key={p._id} />;
              })
            : ""}
        </div>
        <div className="viewAllBtn">
          <button className="btn">
            <a href="/collection/new-arrivals">VIEW ALL</a>
          </button>
        </div>
      </div>
      <div className="bestSellers">
        <h2 className="h2ui">BEST SELLERS</h2>
        <div className="productListContainer">
          {trending.length > 0
            ? trending.map((p) => {
                return <ProductCard product={p} key={p._id} />;
              })
            : ""}
        </div>
        <div className="viewAllBtn">
          <button className="btn">
            <a href="/collection/trending">VIEW ALL</a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCollection;
