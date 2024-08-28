import { RiSecurePaymentFill } from "react-icons/ri";
import { BsLightningChargeFill } from "react-icons/bs";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import "./features.css";

function Features() {
  return (
    <>
      <div className="features">
        <div>
          <RiSecurePaymentFill />
          <h3>Secure Payments</h3>
        </div>
        <div>
          <img
            src="https://zeevector.com/wp-content/uploads/2021/02/Make-in-India-Logo-PNG-HD.png"
            alt=""
          />
          <h3>Made in India</h3>
        </div>
        <div>
          <BsLightningChargeFill />
          <h3>Shipping within 48 hours</h3>
        </div>
      </div>
      <div className="features-mobile">
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showStatus={false}
          showIndicators={false}
          stopOnHover={false}
        >
          <div>
            <RiSecurePaymentFill />
            <h3>Secure Payments</h3>
          </div>
          <div>
            <img
              src="https://zeevector.com/wp-content/uploads/2021/02/Make-in-India-Logo-PNG-HD.png"
              alt="Made in India"
            />
            <h3>Made in India</h3>
          </div>
          <div>
            <BsLightningChargeFill />
            <h3>Shipping within 48 hours</h3>
          </div>
        </Carousel>
      </div>
    </>
  );
}

export default Features;
