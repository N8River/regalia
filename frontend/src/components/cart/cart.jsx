import useCartInfo from "../../hooks/useCartInfo";
import CartProduct from "./cartProduct/cartProduct";
import "./cart.css";
import { useState, useEffect } from "react";

import { MdOutlineChevronRight } from "react-icons/md";

function Cart() {
  const { cartInfo, fetchCartInfo } = useCartInfo();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (cartInfo) {
      setTotalPrice(cartInfo.totalPrice);
      setCart(cartInfo);
    }
    console.log(cartInfo);
  }, [cartInfo]);

  // const fetchCartInfo = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch cart info");
  //     }

  //     const responseData = await response.json();
  //     setCart(responseData);

  //     console.log(cart);
  //   } catch (error) {
  //     console.log("Error fetching cart info:", error);
  //   }
  // };

  // fetchCartInfo();

  const handleDelete = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.productId._id !== productId),
    }));
    fetchCartInfo();
  };

  const handleUpdate = () => {
    fetchCartInfo();
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      <p>{totalPrice > 499 ? "You are eligible for free shipping." : ""}</p>

      <div className="cartProducts">
        <div className="cartHeader">
          <div>PRODUCT</div>
          <div>QUANTITY</div>
          <div>TOTAL</div>
        </div>
        <div className="cartProductList">
          {cartInfo && cartInfo.items.length > 0 ? (
            cartInfo.items.map((item) => {
              return (
                <CartProduct
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              );
            })
          ) : (
            <big>No Products in your cart!</big>
          )}
        </div>

        {cartInfo && cartInfo.items.length > 0 ? (
          <div className="cartDetails">
            <big>SubTotal: Rs. {totalPrice}</big>
            <small>Apply coupons at checkout!</small>

            <div className="orderNow">
              {cartInfo && cartInfo.items.length > 0 ? (
                <button className="btn">
                  <a href="./checkout">PROCEED TO CHECKOUT</a>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Cart;
