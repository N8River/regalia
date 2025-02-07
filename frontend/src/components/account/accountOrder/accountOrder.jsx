import "./accountOrder.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";

function AccountOrder({ order }) {
  const navigate = useNavigate();

  let numberOfProducts = 0;
  // const [formattedOrderDate, setFormattedOrderDate] = useState(null);

  order.products.forEach((p) => {
    numberOfProducts += +p.quantity;
  });

  const formatOrderDate = (date) => {
    const formattedDate =
      date.split(" ")[0] + ", " + date.split(" ")[2] + " " + date.split(" ")[1];
    return formattedDate;
  };

  const handleNavigation = () => {
    navigate(`/account/${order._id}`);
  };

  return (
    <div className="accountOrder" onClick={handleNavigation}>
      <div className="orderItemImages">
        <Carousel
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          stopOnHover={false}
          swipeable={false}
        >
          {order.products.map((productItem, index) => (
            <div key={index}>
              <img
                src={productItem.product.imageUrl}
                alt={productItem.product.title}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="accountOrderDetails">
        <div>
          <p>Ordered on: {formatOrderDate(order.orderedOn)}</p>
          <p>₹ {order.finalTotal}</p>
          <p>{numberOfProducts} items</p>
        </div>

        <div>
          <p>Status: {order.status}</p>
          {/* <button>
            <small className="smallui">MORE DETAILS</small>
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default AccountOrder;
