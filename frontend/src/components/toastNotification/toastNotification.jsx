import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import "./toastNotification.css";

function ToastNotification({ message, type, onClose }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the duration of the fadeOut animation
  };

  return (
    <>
      <div
        className={`toastNotification ${type} ${isFadingOut ? "fadeOut" : ""}`}
      >
        <p>{message}</p>
        <button onClick={handleClose} className="closeBtnToast">
          <IoIosClose />
        </button>
      </div>
      <div
        className={`toastNotification-modal ${isFadingOut ? "fadeOut" : ""}`}
        onClick={handleClose}
      ></div>
    </>
  );
}

export default ToastNotification;
