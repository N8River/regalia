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

  const perks = [
    {
      icon: <MdLocalShipping className="size-4 text-neutral-500" />,
      text: "Free Shipping above $199",
    },
    {
      icon: <RiDiscountPercentLine className="size-4 text-neutral-500" />,
      text: "Get 10% Off on orders above $259",
    },
    {
      icon: <MdDiscount className="size-4 text-neutral-500" />,
      text: "Get 20% Off on orders above $299",
    },
  ];

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
        },
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
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-6 py-8 sm:px-8 md:flex-row md:items-start md:justify-start md:px-4 lg:gap-8">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl md:max-w-1/2">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="w-full space-y-6 md:max-w-1/2">
        <div className="">
          <h1 className="text-2xl font-medium text-neutral-900 sm:text-3xl">
            {product.title}
          </h1>
          <h2 className="text-2xl leading-loose font-bold text-neutral-900">
            $ {product.price}
          </h2>

          <div className="flex items-center gap-2 text-neutral-600">
            <div className="flex items-center gap-1">
              <FaStar className="text-orange-400" />
              <FaStar className="text-orange-400" />
              <FaStar className="text-orange-400" />
              <FaStar className="text-orange-400" />
              <FaRegStarHalfStroke className="text-orange-400" />
            </div>
            <span className="pt-0.5 text-sm">4 Reviews</span>
          </div>
        </div>

        {/* Shipping and Discount Info */}
        <div className="space-y-3 border-y border-neutral-200 py-4">
          {perks.map((perk, idx) => (
            <div key={idx} className="flex items-center gap-3 text-neutral-600">
              {perk.icon}
              <p className="text-sm">{perk.text}</p>
            </div>
          ))}
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-neutral-700">Quantity:</p>
            <div className="flex items-center rounded-md border border-neutral-200">
              <button
                onClick={decreaseQuantity}
                className="cursor-pointer px-3 py-1 text-lg text-neutral-600 transition-colors hover:bg-neutral-100"
              >
                -
              </button>
              <span className="border-x border-neutral-200 px-4 py-1">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="cursor-pointer px-3 py-1 text-lg text-neutral-600 transition-colors hover:bg-neutral-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              IN STOCK
            </div>
          </div>

          <button
            onClick={AddToCartHandler}
            className="bg-primary hover:bg-primary-hover flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 font-medium text-white transition-colors"
          >
            ADD TO CART
          </button>

          <div className="flex items-center gap-2 text-neutral-600">
            <IoShareSocial className="size-4 hover:text-neutral-900" />
            <a
              href="#"
              className="text-sm transition-colors hover:text-neutral-900"
            >
              Share
            </a>
          </div>
        </div>

        {/* Product Description */}
        <div className="productDescription prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
