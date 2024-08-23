import { RiSecurePaymentFill } from "react-icons/ri";
import { BsLightningChargeFill } from "react-icons/bs";

import "./features.css";

function Features() {
  return (
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
  );
}

export default Features;
