import { CgTrack } from "react-icons/cg";
import OrderItem from "./orderItem/orderItem";
import { MdAssignmentReturn, MdOutlineReportProblem } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "./order.css";

function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [formattedOrderDate, setFormattedOrderDate] = useState(null);
  const [formattedArrivalDate, setFormattedArrivalDate] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/order/fetch-order/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed fetching order by ID");
        }

        const responseData = await response.json();
        setOrder(responseData);
        console.log(responseData);
      } catch (error) {
        console.log("Error fetching order:", error);
      }
    };

    fetchOrder();

    if (order) {
      setFormattedOrderDate(formatOrderDate(order.orderedOn));
      setFormattedArrivalDate(formatArrivalDate(order.arrivingOn));
    }
  }, []);

  const formatOrderDate = (date) => {
    const formattedDate =
      date.split(" ")[0] + ", " + date.split(" ")[2] + " " + date.split(" ")[1];
    return formattedDate;
  };

  const formatArrivalDate = (date) => {
    const formattedDate =
      date.substring(0, 10).split("-")[2] +
      " - " +
      date.substring(0, 10).split("-")[1] +
      " - " +
      date.substring(0, 10).split("-")[0];
    // console.log(formattedDate);
    return formattedDate;
  };

  return (
    <div className="order">
      {order ? (
        <>
          <div className="orderHeader">
            <h4>Order #{order._id}</h4>
            <button>
              <p>Track Order</p>
              <CgTrack />
            </button>
          </div>

          <div className="orderSubHeader">
            <p>Order Date: {formattedOrderDate}</p>
            <p>Estimated Delivery: {formattedArrivalDate}</p>
          </div>

          <div className="orderItems">
            {order.products.map((orderItem) => {
              return <OrderItem orderItem={orderItem} />;
            })}
          </div>

          <div className="orderPaymentAndDelivery">
            <div className="payment">
              <big>Payment</big>
              <div>
                {order.paymentMethod === "cashOnDelivery" ? (
                  <p>Cash on Delivery</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="delivery">
              <big>Delivery Address</big>

              <p>
                {order.address.line1}, {order.address.line2}
              </p>
              <p>
                {order.address.zip} {order.address.city}
              </p>
              <p>{order.address.country}</p>
            </div>
          </div>

          <div className="helpAndSummary">
            <div className="orderHelp">
              <big>Need Help?</big>
              <button>
                <MdAssignmentReturn /> <p>Returns</p>
              </button>
              <button>
                <MdOutlineReportProblem /> <p>Order Issues</p>
              </button>
            </div>

            <div className="orderSummary">
              <big>Order Summary</big>
              <div className="orderSubTotal">
                <p>Subtotal</p>
                <p>Rs. {order.subTotal}</p>
              </div>
              <div className="orderDiscount">
                <p>Discount</p>
                <p>
                  (-{order.discount}%) Rs. {order.discountAmount}
                </p>
              </div>
              <div className="deliveryCharges">
                <p>Delivery Charges</p>
                <p>
                  {order.deliveryCharge === 0
                    ? "FREE"
                    : `Rs. ${order.deliveryCharge}`}
                </p>
              </div>
              <div className="orderTotal">
                <big>Total</big>
                <big>Rs. {order.finalTotal}</big>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Order;
