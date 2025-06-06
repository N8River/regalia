// import "./collectionCard.css";
import { useNavigate } from "react-router-dom";

function CollectionCard({ collectionInfo }) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 "
      onClick={() => navigate(collectionInfo.path)}
    >
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 saturate-[0.75]"
          src={collectionInfo.img}
          alt={collectionInfo.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 group" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h1 className="text-2xl font-medium text-white text-center">
          {collectionInfo.name}
        </h1>
      </div>
    </div>
  );
}

export default CollectionCard;
