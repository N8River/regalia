import "./productCard.css";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const HandleNavigation = () => {
    navigate(`/collection/${product._id}`);
  };

  return (
    <div className="productCard" onClick={HandleNavigation}>
      <div className="productImgContainer">
        <img
          className="productImg"
          src={product.imageUrl}
          alt={product.title}
        />
      </div>
      <div className="productInfo">
        <big>{product.title}</big>
        <p>Rs. {product.price}</p>
        {/* <div>{product.rating}</div> */}
      </div>
    </div>
  );
}

export default ProductCard;
