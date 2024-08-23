import "./checkoutItem.css";

function CheckoutItem({ item }) {
  // console.log(item);

  return (
    <div className="checkoutItem">
      <div className="checkoutItemImg">
        <img src={item.productId.imageUrl} alt={item.productId.title} />
      </div>
      <div className="checkoutItemNameQuantity">
        <p>{item.productId.title}</p>
        <small>Qty. {item.quantity}</small>
      </div>
      <div className="checkoutItemPrice">
        <p>Rs. {item.productId.price}</p>
      </div>
    </div>
  );
}

export default CheckoutItem;
