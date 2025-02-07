import { useState, useEffect } from "react";

const useResponsive = (threshold = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= threshold);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= threshold);
    };

    // Add the event listener to listen for window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [threshold]);

  return { isMobile };
};

export default useResponsive;
