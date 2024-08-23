import { useNavigate } from "react-router-dom";
import "./collectionList.css";

function CollectionList() {
  const navigate = useNavigate();

  return (
    <div className="collectionList">
      <div
        className="collectionType"
        onClick={() => {
          navigate("/collection/earrings");
        }}
      >
        <div className="circleImg">
          <img
            src="https://misobysonia.com/cdn/shop/files/earrings.jpg?v=1691959697&width=400"
            alt=""
          />
        </div>
        <h3>Earrings</h3>
      </div>

      <div
        className="collectionType"
        onClick={() => {
          navigate("/collection/bracelets");
        }}
      >
        <div className="circleImg">
          <img
            src="https://misobysonia.com/cdn/shop/files/bracelets.jpg?v=1691922552&width=400"
            alt=""
          />
        </div>
        <h3>Bracelet</h3>
      </div>

      <div
        className="collectionType"
        onClick={() => {
          navigate("/collection/chains");
        }}
      >
        <div className="circleImg">
          <img
            src="https://misobysonia.com/cdn/shop/files/chains.jpg?v=1691959696&width=400"
            alt=""
          />
        </div>
        <h3>Chains</h3>
      </div>

      <div
        className="collectionType"
        onClick={() => {
          navigate("/collection/rings");
        }}
      >
        <div className="circleImg">
          <img
            src="https://misobysonia.com/cdn/shop/files/rings.jpg?v=1691959695&width=400"
            alt=""
          />
        </div>
        <h3>Rings</h3>
      </div>
    </div>
  );
}

export default CollectionList;
