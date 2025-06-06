import useCartInfo from "../../hooks/useCartInfo";
import CartProduct from "./cartProduct/cartProduct";
import "./cart.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlineChevronRight } from "react-icons/md";

function Cart() {
  const { cartInfo, fetchCartInfo } = useCartInfo();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cart, setCart] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (cartInfo) {
      setTotalPrice(cartInfo.totalPrice);
      setCart(cartInfo);
    }
  }, [cartInfo]);

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
    <>
      {cartInfo && cartInfo.items.length > 0 ? (
        <div className="cart">
          <h2>Cart</h2>
          <p>
            {totalPrice > 499
              ? "You are eligible for free shipping."
              : `Spend ₹ ${(500 - totalPrice).toFixed(
                  2,
                )} to get free shipping on this order!`}
          </p>

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
                <big>Subtotal: ₹ {totalPrice}</big>
                <small>Apply coupons at checkout!</small>

                <div className="orderNow">
                  {cartInfo && cartInfo.items.length > 0 ? (
                    <button
                      className="btn"
                      onClick={() => {
                        navigate("/checkout");
                      }}
                    >
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
      ) : (
        <div className="flex h-full min-h-[66vh] flex-col items-center justify-center">
          <div className="text-xl leading-tight font-medium capitalize">
            Your cart is empty
          </div>
          <div className="mt-1 mb-4 w-xl text-center text-sm leading-relaxed text-neutral-600">
            Visit our vast collection to find your next favorite piece.
          </div>
          <button
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-lg px-6 py-2 text-base font-medium text-white transition"
            onClick={() => navigate("/collection")}
          >
            SHOP NOW
          </button>
        </div>
      )}
    </>
  );
}

export default Cart;
