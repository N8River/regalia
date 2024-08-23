import "./collectionCard.css";
import { useNavigate } from "react-router-dom";

function CollectionCard({ collectionInfo }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="collectionCard"
        onClick={() => {
          navigate(collectionInfo.path);
        }}
      >
        <div className="collectionCardImgContainer">
          <img
            className="collectionCardImg"
            src={collectionInfo.img}
            alt={collectionInfo.name}
          />
        </div>
        <div className="collectionCardNameContainer">
          <h1 className="collectionCardName h2ui">{collectionInfo.name}</h1>
        </div>
      </div>
    </>
  );
}

export default CollectionCard;
