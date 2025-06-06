import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="bg-neutral-800 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-8 md:grid md:grid-cols-3 md:gap-8 md:px-8 xl:gap-12">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">About</h4>
          <p className="text-sm leading-loose text-neutral-300 md:leading-relaxed">
            Discover the timeless elegance of Regalia — where exquisite
            craftsmanship meets modern design. Each piece is thoughtfully
            created to celebrate individuality and elevate your everyday style.
            Embrace the art of fine jewelry with Regalia.
          </p>
          <div className="flex gap-4">
            <a
              href=""
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <FaFacebook className="h-5 w-5 text-neutral-400 transition-colors hover:text-white" />
            </a>
            <a
              href=""
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <FaInstagram className="h-5 w-5 text-neutral-400 transition-colors hover:text-white" />
            </a>
            <a
              href=""
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <FaXTwitter className="h-5 w-5 text-neutral-400 transition-colors hover:text-white" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Help</h4>
          <div className="space-y-2">
            <p className="cursor-pointer text-sm text-neutral-300 transition-colors hover:text-white">
              Shipping Policy
            </p>
            <p className="cursor-pointer text-sm text-neutral-300 transition-colors hover:text-white">
              Contact Us
            </p>
            <p className="cursor-pointer text-sm text-neutral-300 transition-colors hover:text-white">
              Return or Exchange
            </p>
          </div>
        </div>

        <div className="">
          <h4 className="mb-4 text-lg font-semibold text-white">Newsletter</h4>
          <p className="mb-2 text-sm text-neutral-300">
            Sign up to our newsletter to receive exclusive offers.
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Enter your e-email"
              className="w-full rounded-md border border-neutral-500 px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-neutral-300 px-4 py-2 font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Footer;
