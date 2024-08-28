import "./orderItem.css";
import { useNavigate } from "react-router-dom";

function OrderItem({ orderItem }) {
  const navigate = useNavigate();
  const product = orderItem.product;

  const handleNavigate = () => {
    navigate(`/collection/${product._id}`);
  };

  return (
    <div className="orderItem" onClick={handleNavigate}>
      <div className="orderItemImg">
        <img src={product.imageUrl} alt={product.title} />
      </div>

      <div className="orderItemInfo">
        <big>{product.title}</big>
      </div>

      <div className="orderItemPriceAndQuantity">
        <big>{"Rs. " + product.price}</big>
        <p>{"Qty. " + orderItem.quantity}</p>
      </div>
    </div>
  );
}

export default OrderItem;
