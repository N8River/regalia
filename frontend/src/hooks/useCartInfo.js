import { useState, useEffect, useCallback } from "react";

const useCartInfo = () => {
  const [cartInfo, setCartInfo] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCartInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart info");
      }

      const responseData = await response.json();
      setCartInfo(responseData);
    } catch (error) {
      console.log("Error fetching cart info:", error);
    }
  }, []);

  useEffect(() => {
    token && fetchCartInfo();
  }, [fetchCartInfo]);

  return { cartInfo, fetchCartInfo };
};

export default useCartInfo;
