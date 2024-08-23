import Address from "./addressCheckout/addressCheckout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutItem from "./checkoutItem/checkoutItem";

import { MdLocalShipping } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { BsBagCheckFill } from "react-icons/bs";
import { GoHorizontalRule } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import { FaCreditCard } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

import "./checkout.css";
import AddressCheckout from "./addressCheckout/addressCheckout";

import useCartInfo from "../../hooks/useCartInfo";
import { useToast } from "../../context/ToastContext";

function Checkout() {
  const addToast = useToast();
  const cart = useCartInfo();
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [couponCode, setCouponCode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [address, setAddresses] = useState(null);
  const navigate = useNavigate();

  const [discount, setDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const [checkoutItemVisible, setCheckoutItemVisible] = useState(false);

  const stages = {
    SHIPPING: "shipping",
    PAYMENT: "payment",
    REVIEW: "review",
  };
  const [currentStage, setCurrentStage] = useState(stages.SHIPPING);

  const token = localStorage.getItem("token");
  const currentDate = new Date();
  const orderDate = currentDate.toString();
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(currentDate.getDate() + 5);
  const estimatedDeliveryDateString =
    estimatedDeliveryDate.toDateString().split(" ")[0] +
    ", " +
    estimatedDeliveryDate.toDateString().split(" ")[2] +
    " " +
    estimatedDeliveryDate.toDateString().split(" ")[1];

  // console.log(estimatedDeliveryDateString);

  useEffect(() => {
    fetchAddress();
    // console.log(cart.cartInfo);
    if (cart.cartInfo) {
      deliveryChargeCalc(cart);
    }
  }, [cart]);

  const fetchAddress = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();
      setAddresses(data);

      // Set the default address as the selected address
      const defaultAddress = data.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]); // fallback to the first address if no default is set
      }
    } catch (error) {
      console.log("Error fetching addresses:", error);
    }
  };

  const selectAddressHandler = (address) => {
    setSelectedAddress(address);
  };

  const paymentMethodChangeHandler = (method) => () => {
    setPaymentMethod(method);
  };

  const handleOrderCreation = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products: cart.cartInfo.items.map((item) => ({
              product: item.productId,
              quantity: item.quantity,
            })),
            subTotal: cart.cartInfo.totalPrice,
            address: selectedAddress,
            arrivingOn: estimatedDeliveryDate,
            discountAmount: discountAmount,
            discount: discount,
            deliveryCharge: deliveryCharge,
            finalTotal:
              cart.cartInfo.totalPrice + deliveryCharge - discountAmount,
            paymentMethod,
            cardDetails: {
              cardNumber: cardNumber,
              expiration: cardExp,
              securityCode: cardCVV,
            },
            orderedOn: orderDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create the order");
      }

      const orderData = await response.json();

      navigate(`/account/${orderData._id}`);
    } catch (error) {
      console.log("Error creating the order:", error);
    }
  };

  const deliveryChargeCalc = (cart) => {
    if (cart && cart.cartInfo.totalPrice >= 499) {
      setDeliveryCharge(0);
    } else {
      setDeliveryCharge(120);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupon/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: couponCode.toUpperCase(),
            cartTotal: cart.cartInfo.totalPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error validating coupon");
      }

      const responseData = await response.json();

      setDiscountAmount(responseData.discountAmount);
      setDiscount(responseData.discount);
      // console.log("🔴 Response Data:", responseData);
    } catch (error) {
      console.log("Failed to check coupon:", error);
    }
  };

  const formatCardNumber = (cardNumber) => {
    const lastFourDigits = cardNumber.slice(-4);
    return `**** **** **** ${lastFourDigits}`;
  };

  const handleCheckoutItemDropdown = () => {
    setCheckoutItemVisible(!checkoutItemVisible);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case stages.SHIPPING:
        return (
          <div className="checkoutShipping">
            <div className="checkoutAddressSelect">
              <div className="checkoutAddressSelectHeader">
                <big>Address</big>
                <button
                  className="linkBtn"
                  onClick={() => {
                    navigate("/account/address");
                  }}
                >
                  Manage Address
                </button>
              </div>
              {address && address.length > 0 ? (
                address
                  .sort((a, b) =>
                    a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
                  )
                  .map((addr, index) => (
                    <AddressCheckout
                      onPage={"shipping"}
                      key={index}
                      address={addr}
                      isSelected={
                        selectedAddress && selectedAddress._id === addr._id
                      }
                      selectAddressHandler={() => selectAddressHandler(addr)}
                    />
                  ))
              ) : (
                <p>You have no saved addresses!</p>
              )}
            </div>
            <div className="checkoutDeliveryEstimate">
              <big>DELIVERY ESTIMATE</big>
              <div className="standardDelivery">
                <TbTruckDelivery />
                <div>
                  <big>Standard Delivery</big>
                  <p>5-7 days</p>
                </div>
              </div>
            </div>
          </div>
        );
      case stages.PAYMENT:
        return (
          <div className="checkoutPayment">
            <div className="checkoutPaymentMethod">
              <big>Payment Method</big>
              <div className="paymentMethods">
                <div
                  className={`paymentMethod ${
                    paymentMethod === "cashOnDelivery" ? "selected" : ""
                  }`}
                  onClick={paymentMethodChangeHandler("cashOnDelivery")}
                >
                  <p>Cash on delivery</p>
                </div>
                <div
                  className={`paymentMethod ${
                    paymentMethod === "card" ? "selected" : ""
                  }`}
                  onClick={paymentMethodChangeHandler("card")}
                >
                  <FaCreditCard />
                  <p>Pay With Card</p>
                </div>
              </div>
              {paymentMethod === "card" && (
                <div className="cardInfoForm">
                  <form>
                    <p>Card Number</p>
                    <input
                      type="number"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                    <p>Expiration</p>
                    <input
                      type="text"
                      placeholder="mm/yy"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                    />
                    <p>Security Code</p>
                    <input
                      type="number"
                      placeholder="XXX"
                      required
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                    />
                  </form>
                </div>
              )}
            </div>
            <div className="checkoutCouponCode">
              <big>Coupon Code</big>
              <div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} className="btn">
                  Apply Coupon
                </button>
              </div>
            </div>
          </div>
        );
      case stages.REVIEW:
        return (
          <div className="checkoutReview">
            <div className="checkoutSection">
              <div className="sectionTitle">
                <p>SHIP TO</p>
              </div>
              <div className="sectionContent">
                <AddressCheckout onPage={"review"} address={selectedAddress} />
              </div>
            </div>
            <div className="checkoutSection">
              <div className="sectionTitle">
                <p>DELIVERY</p>
              </div>
              <div className="sectionContent">
                <div>
                  <p>STANDARD DELIVERY</p>
                </div>
                <div>
                  <p>{estimatedDeliveryDateString}</p>
                </div>
              </div>
            </div>
            <div className="checkoutSection">
              <div className="sectionTitle">
                <p>PAYMENT</p>
              </div>
              <div className="sectionContent">
                {paymentMethod === "card" ? (
                  <>
                    <p>CARD</p>
                    <small>{formatCardNumber(cardNumber)}</small>
                  </>
                ) : (
                  <p>CASH ON DELIVERY</p>
                )}
              </div>
            </div>
            <div className="checkoutItems">
              <div
                className={`checkoutItemsDropdownHeader ${
                  checkoutItemVisible ? "borderBottom" : ""
                }`}
                onClick={handleCheckoutItemDropdown}
              >
                <p>ITEMS ({cart.cartInfo && cart.cartInfo.items.length})</p>
                <button>
                  <IoIosArrowDown
                    className={`checkoutItemArrow ${
                      checkoutItemVisible ? "invert" : ""
                    }`}
                  />
                </button>
              </div>
              <div
                className={`checkoutItemsList ${
                  checkoutItemVisible ? "show" : ""
                }`}
              >
                {cart &&
                  cart.cartInfo.items.map((item) => (
                    <CheckoutItem key={item._id} item={item} />
                  ))}
              </div>
            </div>
            <div className="checkoutSummary">
              <div className="checkoutSummarySection">
                <div>SUBTOTAL</div>
                <div>Rs. {cart && cart.cartInfo.totalPrice}</div>
              </div>
              <div className="checkoutSummarySection">
                <div>DELIVERY CHARGES</div>
                <div>Rs. {deliveryCharge}</div>
              </div>
              <div className="checkoutSummarySection">
                <div>DISCOUNT</div>
                <div>
                  {discount ? `(-${discount}%)  Rs. ${discountAmount}` : "-"}
                </div>
              </div>
              <div className="checkoutSummarySection">
                <div>TOTAL</div>
                <div>
                  Rs.{" "}
                  {cart.cartInfo.totalPrice + deliveryCharge - discountAmount}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStage === stages.SHIPPING) {
      if (!selectedAddress) {
        addToast(
          "Please select an address before proceeding to the payment section",
          "error"
        );
        return;
      }
      setCurrentStage(stages.PAYMENT);
    } else if (currentStage === stages.PAYMENT) {
      setCurrentStage(stages.REVIEW);
    } else if (currentStage === stages.REVIEW) {
      handleOrderCreation();
      // navigate("/");
    }
  };

  const handlePrevious = () => {
    if (currentStage === stages.PAYMENT) {
      setCurrentStage(stages.SHIPPING);
    } else if (currentStage === stages.REVIEW) {
      setCurrentStage(stages.PAYMENT);
    }
  };

  return (
    <div className="checkout">
      <div className="checkoutProgressBar">
        <div className={currentStage === stages.SHIPPING ? "active" : ""}>
          <MdLocalShipping />
          <p>SHIPPING</p>
        </div>
        <GoHorizontalRule className="dash-svg" />
        <div className={currentStage === stages.PAYMENT ? "active" : ""}>
          <MdOutlinePayment />
          <p>PAYMENT</p>
        </div>
        <GoHorizontalRule className="dash-svg" />
        <div className={currentStage === stages.REVIEW ? "active" : ""}>
          <BsBagCheckFill />
          <p>REVIEW</p>
        </div>
      </div>
      {renderCurrentStage()}
      <div className="checkoutProgressBtn">
        {currentStage !== stages.SHIPPING && (
          <button onClick={handlePrevious} className="btn">
            <FaChevronLeft />
            <big>BACK</big>
          </button>
        )}
        <button onClick={handleNext} className="btn">
          {currentStage === stages.REVIEW ? (
            <big>PLACE ORDER</big>
          ) : (
            <>
              <big>NEXT</big>

              <FaChevronRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
