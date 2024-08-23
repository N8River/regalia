import "./collection.css";
import CollectionCard from "./collectionCard/collectionCard";

function Collections() {
  const collectionInfo = [
    {
      img: "https://misobysonia.com/cdn/shop/files/1-4.jpg?v=1691410670&width=800",
      name: "ALL PRODUCTS",
      path: "/collection/all-products",
    },
    {
      img: "https://misobysonia.com/cdn/shop/files/berserk.png?v=1702377293&width=800",
      name: "BEST SELLERS",
      path: "/collection/trending",
    },
    {
      img: "https://misobysonia.com/cdn/shop/files/9_cd7a4d38-1f32-4f9f-846f-6cb9ce8386ea.jpg?v=1716540467&width=800",
      name: "NEW ARRIVALS",
      path: "/collection/new-arrivals",
    },
    {
      img: "https://misobysonia.com/cdn/shop/files/1_ca5a0855-5b98-4545-9dcd-ba607e2fe38d.png?v=1709195393&width=800",
      name: "Chains",
      path: "/collection/chains",
    },
    {
      img: "https://misobysonia.com/cdn/shop/files/4_e918432a-f2b5-42e2-8619-174331af1c71.jpg?v=1693111829&width=800",
      name: "Bracelets",
      path: "/collection/bracelets",
    },
    {
      img: "https://misobysonia.com/cdn/shop/files/1_8eb44eb8-9b7d-41c0-b40d-afacaca68393.png?v=1712398905&width=800",
      name: "Rings",
      path: "/collection/rings",
    },
  ];

  return (
    <div className="collections">
      <h1 className="h1ui">ALL COLLECTIONS</h1>
      <div className="collectionTiles">
        {collectionInfo.map((i) => {
          return <CollectionCard collectionInfo={i} key={i.name} />;
        })}
      </div>
    </div>
  );
}

export default Collections;
