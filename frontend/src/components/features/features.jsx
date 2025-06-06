import { RiSecurePaymentFill } from "react-icons/ri";
import { BsLightningChargeFill } from "react-icons/bs";
import { MdOutlineWaterDrop } from "react-icons/md";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useResponsive from "../../hooks/useResponsive";

const features = [
  {
    icon: <RiSecurePaymentFill className="h-8 w-8 text-neutral-600" />,
    title: "Secure Payments",
    description: "Pay with confidence",
  },
  {
    icon: <BsLightningChargeFill className="h-8 w-8 text-neutral-600" />,
    title: "Shipping within 48 Hours",
    description: "Quick dispatch for faster delivery",
  },
  {
    icon: <MdOutlineWaterDrop className="h-8 w-8 text-neutral-600" />,
    title: "Waterproof & Tarnish-Free",
    description: "Made to last",
  },
];

function Features() {
  const { isMobile } = useResponsive(640);

  const FeatureCard = ({ icon, title, description }) => (
    <div className="mb-4 flex flex-col items-center rounded-2xl border border-neutral-100 bg-white px-3 pt-6 pb-6 shadow-sm shadow-neutral-300 backdrop-blur-sm transition-all duration-300 hover:shadow-md md:mb-0">
      <div className="mb-1 p-4">{icon}</div>
      <h3 className="mb-1 text-center text-base font-semibold text-neutral-900 capitalize lg:text-lg">
        {title}
      </h3>
      <p className="text-center text-sm text-neutral-500">{description}</p>
    </div>
  );

  if (isMobile) {
    return (
      <div className="border-t border-b border-neutral-200 px-4 py-10">
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showStatus={false}
          showIndicators={false}
          showArrows={false}
          stopOnHover={false}
          className="mx-auto max-w-sm"
        >
          {features.map((feature, index) => (
            <div key={index} className="px-4">
              <FeatureCard {...feature} />
            </div>
          ))}
        </Carousel>
      </div>
    );
  }

  return (
    <div className="border-t border-neutral-200 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-4 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
