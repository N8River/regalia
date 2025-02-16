import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useToast } from "./ToastContext";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const addToast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (isExpired) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    return decodedToken.exp < currentTime; // check if expiration time is in the past
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // assume token is expired if there's an error
  }
};
