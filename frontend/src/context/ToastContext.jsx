import React, { useState, createContext, useContext } from "react";
import ToastNotification from "../components/toastNotification/toastNotification";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // Only one toast

  const addToast = (message, type) => {
    setToast({ message, type });
  };

  const removeToast = () => {
    setToast(null); // Clear the current toast
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);
