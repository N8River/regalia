import { RiSecurePaymentFill } from "react-icons/ri";
import { BsLightningChargeFill } from "react-icons/bs";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import MakeInIndiaLogo from "../../assets/pictures/make-in-india-logo.png";

import useResponsive from "../../hooks/useResponsive";

import "./features.css";

function Features() {
  const { isMobile } = useResponsive(640);

  return (
    <>
      {isMobile ? (
        <div className="features-mobile">
          <Carousel
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            showStatus={false}
            showIndicators={false}
            showArrows={false}
            stopOnHover={false}
          >
            <div className="featureWrapper">
              <RiSecurePaymentFill />
              <h3>Secure Payments</h3>
            </div>
            <div className="featureWrapper">
              <img src={MakeInIndiaLogo} alt="Made in India" />
              <h3>Made in India</h3>
            </div>
            <div className="featureWrapper">
              <BsLightningChargeFill />
              <h3>Shipping within 48 hours</h3>
            </div>
          </Carousel>
        </div>
      ) : (
        <div className="features">
          <div className="featureWrapper">
            <RiSecurePaymentFill />
            <h3>Secure Payments</h3>
          </div>
          <div className="featureWrapper">
            <img src={MakeInIndiaLogo} alt="" />
            <h3>Made in India</h3>
          </div>
          <div className="featureWrapper">
            <BsLightningChargeFill />
            <h3>Shipping within 48 hours</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default Features;
