import { useEffect, useState } from "react";
import "./cartProduct.css";
import useResponsive from "../../../hooks/useResponsive";
import { useCart } from "../../../context/CartContext";

function CartProduct({ item, onDelete, onUpdate }) {
  const [product, setProduct] = useState(item);
  const token = localStorage.getItem("token");

  const { updateCartCount } = useCart();

  const { isMobile } = useResponsive(640);

  useEffect(() => {
    setProduct(item);
  }, [item]);

  const deleteProductHandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/${product.productId._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.productId._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }

      onDelete(product.productId._id);
      onUpdate();
      updateCartCount();
      // console.log("Item deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartQuantity = async (newQuantity) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.productId._id,
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      const responseData = await response.json();
      // console.log(responseData);
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: newQuantity,
      }));
      onUpdate();
      updateCartCount();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = () => {
    updateCartQuantity(product.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (product.quantity > 1) {
      updateCartQuantity(product.quantity - 1);
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="cartProduct mobile">
          <div className="cartProductInfo">
            <div className="cartProductImg">
              <img
                src={product.productId.imageUrl}
                alt={product.productId.title}
              />
            </div>
            <div className="cartProductTitlePrice">
              <h4>{product.productId.title}</h4>
              <big>₹ {product.productId.price}</big>
              <div className="quantityCart">
                <div className="changeQuantityCart">
                  <button
                    onClick={decreaseQuantity}
                    style={{ cursor: "pointer" }}
                    className="btn"
                  >
                    -
                  </button>
                  <p>{product.quantity} </p>
                  <button
                    onClick={increaseQuantity}
                    style={{ cursor: "pointer" }}
                    className="btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={deleteProductHandler}
                className="linkBtn deleteProductCart"
              >
                <p>Delete</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="cartProduct">
          <div className="cartProductInfo">
            <div className="cartProductImg">
              <img
                src={product.productId.imageUrl}
                alt={product.productId.title}
              />
            </div>
            <div className="cartProductTitlePrice">
              <h4>{product.productId.title}</h4>
              <big>₹ {product.productId.price}</big>
            </div>
          </div>
          <div className="quantityCart">
            <div className="changeQuantityCart">
              <button
                onClick={decreaseQuantity}
                style={{ cursor: "pointer" }}
                className="btn"
              >
                -
              </button>
              <p>{product.quantity} </p>
              <button
                onClick={increaseQuantity}
                style={{ cursor: "pointer" }}
                className="btn"
              >
                +
              </button>
            </div>
            <div className="deleteProductCart">
              <button onClick={deleteProductHandler}>
                <p>Delete</p>
              </button>
            </div>
          </div>
          <div className="subSubTotal">
            <big>
              ₹ {+(product.quantity * product.productId.price).toFixed(2)}
            </big>
          </div>
        </div>
      )}
    </>
  );
}

export default CartProduct;
