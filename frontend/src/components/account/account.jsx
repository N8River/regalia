import { MdOutlineChevronLeft } from "react-icons/md";
import "./account.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUserInfo from "../../hooks/useUserInfo";
import AccountOrder from "./accountOrder/accountOrder";

function Account() {
  const userInfo = useUserInfo();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/fetch-order`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const responseData = await response.json();
        setOrders(responseData);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    fetchOrder();
    console.log(orders);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/account/login");
  };

  return (
    <div className="account">
      <div className="accountToolbar">
        <div className="logOutBtn">
          <button onClick={handleLogout}>
            <MdOutlineChevronLeft /> Log Out
          </button>
        </div>
        <h2>YOUR ACCOUNT</h2>
        <h4>View all your orders and manage your account information.</h4>
      </div>
      <div className="accountInfo">
        <div className="orders">
          <big>YOUR ORDERS</big>
          {orders ? (
            orders.map((order, index) => {
              return <AccountOrder key={index} order={order} />;
            })
          ) : (
            <>
              <p>You haven't placed any orders yet.</p>
              <button className="btn">
                <a href="/collection/all-products">CONTINUE SHOPPING</a>
              </button>
            </>
          )}
        </div>
        <div className="address">
          <big>DEFAULT ADDRESS</big>
          {userInfo ? (
            <>
              <p>
                {userInfo.firstName} {userInfo.lastName}
              </p>

              {userInfo.address && userInfo.address.length > 0 ? (
                userInfo.address
                  .filter((address) => address.isDefault) // Filter to get only the default address
                  .map((address, index) => (
                    <div className="addressList" key={index}>
                      <p>
                        {address.line1} {address.line2}
                      </p>
                      <p>
                        {address.zip} {address.city}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  ))
              ) : (
                <p>You have no addresses saved for now!</p>
              )}
            </>
          ) : (
            ""
          )}
          <div>
            <button className="btn">
              <a href="/account/address">MANAGE</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
