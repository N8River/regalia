import React, { useState, createContext, useContext } from "react";
import ToastNotification from "../components/toastNotification/toastNotification";

// Create a context that will hold our notification management functions
const ToastContext = createContext();

// The provider component that wraps around the app and manages toasts
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    console.log("Adding toast:", message, type);
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.length > 0 && <div className="toast-overlay"></div>}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);
