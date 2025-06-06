import { useNavigate } from "react-router-dom";
// import "./collectionList.css";

const collections = [
  {
    name: "Bracelet",
    path: "/collection/bracelets",
    img: "/images/hero/hero-bracelet.webp",
  },
  {
    name: "Earrings",
    path: "/collection/earrings",
    img: "/images/hero/hero-earrings-2.webp",
  },

  {
    name: "Chains",
    path: "/collection/chains",
    img: "/images/hero/hero-necklace.webp",
  },
  {
    name: "Rings",
    path: "/collection/rings",
    img: "/images/hero/hero-ring.webp",
  },
];

function CollectionList() {
  const navigate = useNavigate();

  return (
    <div className="collectionList flex items-center overflow-x-auto bg-neutral-100 px-0 sm:px-2 md:justify-center lg:px-3">
      {collections.map((col) => (
        <div
          className="collectionType group relative min-w-[30%] flex-1 flex-shrink-0 px-1.5 py-3 sm:px-2 sm:py-4 md:min-w-0 lg:px-3 lg:py-6"
          key={col.name}
          onClick={() => navigate(col.path)}
        >
          <div className="circleImg relative mx-auto cursor-pointer overflow-hidden rounded-2xl">
            <img
              src={col.img}
              alt={col.name}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90"
            />
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute bottom-0 z-10 h-2/5 w-full bg-gradient-to-t from-black/65 to-transparent mix-blend-multiply"></div>
          </div>
          <h3 className="xs:text-base absolute bottom-2 left-1/2 z-11 -translate-x-1/2 py-2 text-center text-sm font-medium tracking-wide text-white uppercase sm:py-4 sm:text-lg lg:bottom-6 lg:text-xl">
            {col.name}
          </h3>
        </div>
      ))}
    </div>
  );
}

export default CollectionList;
