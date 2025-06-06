// import "./collection.css";
import CollectionCard from "./collectionCard/collectionCard";

function Collections() {
  const collectionInfo = [
    {
      img: "/images/categories/all-products.webp",
      name: "ALL PRODUCTS",
      path: "/collection/all-products",
    },
    {
      img: "/images/categories/best-sellers.webp",
      name: "BEST SELLERS",
      path: "/collection/trending",
    },
    {
      img: "/images/categories/chains.webp",
      name: "CHAINS",
      path: "/collection/chains",
    },
    {
      img: "/images/categories/earrings.webp",
      name: "EARRINGS",
      path: "/collection/earrings",
    },

    {
      img: "/images/categories/bracelets.webp",
      name: "BRACELETS",
      path: "/collection/bracelets",
    },
    {
      img: "/images/categories/rings.webp",
      name: "RINGS",
      path: "/collection/rings",
    },
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="h2 pb-12">OUR COLLECTIONS</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionInfo.map((i) => (
            <CollectionCard collectionInfo={i} key={i.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collections;
