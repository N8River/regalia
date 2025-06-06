import { useEffect, useState } from "react";
import ProductCard from "../productCard/productCard";
import { useNavigate } from "react-router-dom";

function FeaturedCollection() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/products?status=new-arrival&limit=4`,
    )
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
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?status=trending&limit=4`,
    )
      .then((response) => response.json())
      .then((data) => {
        const trendingProducts = data.filter((p) => {
          return p.status === "trending";
        });
        return trendingProducts;
      })
      .then((data) => setTrending(data));
  }, []);

  const sections = [
    {
      title: "NEW ARRIVALS",
      products: newArrivals,
      path: "/collection/new-arrivals",
      isFirst: true,
    },
    {
      title: "BEST SELLERS",
      products: trending,
      path: "/collection/trending",
      isFirst: false,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {sections.map((section, index) => (
        <div
          key={section.title}
          className={`mb-16 w-full ${
            !section.isFirst ? "border-t border-neutral-200" : ""
          }`}
        >
          <h2 className="h2 my-14">{section.title}</h2>
          <div className="flex items-center justify-start gap-8 overflow-x-auto overflow-y-hidden px-6 pb-2 lg:grid lg:grid-cols-4">
            {section.products.length > 0
              ? section.products.map((p, productIndex) => (
                  <ProductCard
                    product={p}
                    key={p._id}
                    style={{ animationDelay: `${productIndex * 0.1}s` }}
                  />
                ))
              : ""}
          </div>
          <div className="mt-12 flex w-full items-center justify-center">
            <button
              className="bg-primary hover:bg-primary-hover cursor-pointer rounded-lg px-4 py-2 font-medium text-white transition-colors duration-300"
              onClick={() => navigate(section.path)}
            >
              VIEW ALL
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturedCollection;
