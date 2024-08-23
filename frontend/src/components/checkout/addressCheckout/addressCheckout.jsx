import { useState } from "react";
import "./addressCheckout.css";

function AddressCheckout({
  address,
  isSelected,
  selectAddressHandler,
  onPage,
}) {
  return (
    <>
      {onPage === "shipping" ? (
        <>
          <div
            onClick={selectAddressHandler}
            className={`addressCheckout ${
              isSelected ? "selected" : ""
            } shippingPage`}
          >
            <p>
              {address.line1}, {address.line2}
            </p>
            <p>
              {address.city} {address.zip}, {address.state}
            </p>
            <p>{address.country}</p>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={selectAddressHandler}
            className={`addressCheckout ${
              isSelected ? "selected" : ""
            } reviewPage`}
          >
            <p>
              {address.line1}, {address.line2}
            </p>
            <p>
              {address.city} {address.zip}
            </p>
            <p>
              {address.state}, {address.country}
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default AddressCheckout;
