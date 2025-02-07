import React from "react";
import "./confirmationModal.css";

function ConfirmationModal({ message, productName, onConfirm, onCancel }) {
  return (
    <>
      <div className="confirmationModal-overlay" onClick={onCancel}></div>
      <div className="confirmationModal">
        <p>{message}</p>
        {productName && <p className="product-name">Product: {productName}</p>}
        <div className="confirmationModal-actions">
          <button className="confirmBtn" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancelBtn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmationModal;
