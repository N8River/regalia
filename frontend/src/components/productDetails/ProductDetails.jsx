import "./ProductDetails.css";

import { MdLocalShipping } from "react-icons/md";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdDiscount } from "react-icons/md";
import { IoShareSocial } from "react-icons/io5";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";

import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";

function ProductDetails({ product }) {
  const navigate = useNavigate();
  const addToast = useToast();

  const { updateCartCount } = useCart();

  const productId = product._id;
  const token = localStorage.getItem("token");

  const [quantity, setQuantity] = useState(1);

  const AddToCartHandler = async () => {
    if (!token) {
      // If the user is not logged in, redirect to the login page
      navigate("/account/login");

      addToast("Please log in to add items to your cart.", "error");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const responseData = await response.json();

      addToast("Product added to cart successfully!", "success");

      await updateCartCount();
    } catch (error) {
      console.log(error);

      addToast("Failed to add product to cart. Please try again.", "error");
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="productDetails">
      <div className="productImgContainer">
        <img src={product.imageUrl} alt={product.title} />
      </div>
      <div className="productInfoContainer">
        <h2>{product.title}</h2>
        <big>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStarHalfStroke />
          <p>4 Reviews</p>
        </big>
        <h4>₹ {product.price}</h4>
        <div className="infoDisplay">
          <div>
            <MdLocalShipping /> <p>Free Shipping above ₹499</p>
          </div>
          <div>
            <RiDiscountPercentLine /> <p>Get 10% Off on orders above ₹699</p>
          </div>
          <div>
            <MdDiscount /> <p>Get 20% Off on orders above ₹1199</p>
          </div>
        </div>
        <div className="quantityModifier">
          <button className="decreaseQuantity" onClick={decreaseQuantity}>
            -
          </button>
          <p>{quantity}</p>
          <button className="increaseQuantity" onClick={increaseQuantity}>
            +
          </button>
        </div>
        <div className="inStock">
          <p>IN STOCK</p>
        </div>
        <div className="addToCart">
          <button className="addToCartBtn btn" onClick={AddToCartHandler}>
            ADD TO CART
          </button>
        </div>

        <div className="shareLink">
          <a href="">
            {" "}
            <IoShareSocial />
            Share
          </a>
        </div>
        <div className="descriptionBox">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
