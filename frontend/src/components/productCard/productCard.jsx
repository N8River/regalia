import { useEffect, useRef } from "react";
import "./productCard.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ProductCard({ product, style }) {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isHomePage = path === "/";

  const cardRef = useRef(null);

  const HandleNavigation = () => {
    navigate(`/collection/${product._id}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add 'fadeIn' class to the element when it's in view
            entry.target.classList.add("fadeIn");
            observer.unobserve(entry.target); // Stop observing once it's visible
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <>
      {isHomePage ? (
        <div
          className="productCard-homePage"
          onClick={HandleNavigation}
          // style={style}
          ref={cardRef}
        >
          <div className="productImgContainer-homePage">
            <img
              className="productImg-homePage"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="productInfo-homePage">
            <big>{product.title}</big>
            <p>₹ {product.price}</p>
            {/* <div>{product.rating}</div> */}
          </div>
        </div>
      ) : (
        <div
          className="productCard"
          onClick={HandleNavigation}
          // style={style}
          ref={cardRef}
        >
          <div className="productImgContainer">
            <img
              className="productImg"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="productInfo">
            <big>{product.title}</big>
            <p>₹ {product.price}</p>
            {/* <div>{product.rating}</div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
