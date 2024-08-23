import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "./footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="about">
        <h4>About</h4>
        <p>
          Discover the timeless elegance of Regalia, a distinguished jewelry
          brand based in India. We craft exquisite pieces that blend traditional
          craftsmanship with modern design, perfect for every occasion. Embrace
          the art of fine jewelry with Regalia.
        </p>
        <div className="socials">
          <a href="">
            <FaFacebook />
          </a>
          <a href="">
            <FaInstagram />
          </a>
          <a href="">
            <FaXTwitter />
          </a>
        </div>
      </div>
      <div className="help">
        <h4>Help</h4>
        <p className="pui">Shipping Policy</p>
        <p className="pui">Contact Us</p>
        <p className="pui">Return or Exchange</p>
      </div>
      <div className="newsletter">
        <h4>Newsletter</h4>
        <p>Sign up to our newsletter to receive exclusive offers.</p>
        <form action="">
          <input type="email" placeholder="Enter your e-email" />
          <div>
            <button type="submit" className="btn">
              <p>SUBSCRIBE</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Footer;
