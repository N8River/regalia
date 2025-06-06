import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ProductCard({ product, style }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isHomePage = path === "/";

  const getDeterministicDiscount = (productId) => {
    // Convert product ID to a number by summing its character codes
    const idSum = productId
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    // Use modulo to get a number between 0-4, then map to discounts
    const discounts = [5, 10, 15, 20, 25];
    return discounts[idSum % discounts.length];
  };

  const discount = getDeterministicDiscount(product._id);
  const originalPrice = product.price;
  const discountedPrice = originalPrice * (1 - discount / 100);

  const HandleNavigation = () => {
    navigate(`/collection/${product._id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {isHomePage ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={cardVariants}
          className="flex w-64 shrink-0 cursor-pointer flex-col items-center lg:w-auto"
          onClick={HandleNavigation}
        >
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl lg:h-auto lg:w-auto">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-cover"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="flex w-full flex-col items-start pt-1.5">
            <span className="block max-w-full overflow-hidden text-sm leading-relaxed font-normal text-ellipsis whitespace-nowrap lg:text-base lg:leading-normal">
              {product.title}
            </span>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-semibold lg:text-base">
                ${discountedPrice.toFixed(2)}
              </p>
              <p className="text-sm font-normal text-neutral-500 line-through">
                ${originalPrice.toFixed(2)}
              </p>
              <span className="text-sm font-medium text-red-500">
                -{discount}%
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={cardVariants}
          className="flex shrink-0 cursor-pointer flex-col items-center lg:w-auto"
          onClick={HandleNavigation}
        >
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl lg:h-auto lg:w-auto">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-cover"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="flex w-full flex-col items-start pt-1.5">
            <span className="block max-w-full overflow-hidden text-sm leading-relaxed font-normal text-ellipsis whitespace-nowrap lg:text-base lg:leading-normal">
              {product.title}
            </span>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-semibold lg:text-base">
                ${discountedPrice.toFixed(2)}
              </p>
              <p className="text-sm font-normal text-neutral-500 line-through">
                ${originalPrice.toFixed(2)}
              </p>
              <span className="text-sm font-medium text-red-500">
                -{discount}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default ProductCard;
