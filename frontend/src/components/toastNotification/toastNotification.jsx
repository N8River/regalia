import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

import "./toastNotification.css";

function ToastNotification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
  }, []);

  return (
    <div className={`toastNotification ${type}`}>
      <p>{message}</p>

      <button onClick={onClose} className="closeBtnToast">
        <IoIosClose />
      </button>
    </div>
  );
}

export default ToastNotification;
