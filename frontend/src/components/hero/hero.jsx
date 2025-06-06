import React from "react";
import { useNavigate } from "react-router-dom";
const Hero = ({
  imageUrl = "/images/hero/regalia-hero-4.webp",
  imageUrlMobile = "/images/hero/regalia-hero-1.webp",
  headline = "Discover Timeless Elegance",
  message = "At Regalia, we believe jewelry is more than an accessory—it's a statement. Our pieces are crafted to celebrate individuality, elevate style, and create lasting memories.",
  ctaText = "Shop Now",
  ctaHref = "/collection",
}) => {
  const navigate = useNavigate();

  return (
    <section className="flex w-full justify-center bg-white">
      <div className="relative flex w-full flex-col items-center">
        <img
          src={imageUrl}
          alt="Brand visual"
          className="z-10 hidden h-[300px] w-screen object-cover object-bottom md:inline md:h-[530px] lg:h-[550px] xl:h-[600px] 2xl:h-[800px]"
        />
        <img
          src={imageUrlMobile}
          alt="Brand visual"
          className="z-10 inline h-[600px] w-screen object-cover object-bottom md:hidden"
        />

        <div className="xs:px-10 absolute top-1/2 left-1/2 z-20 flex w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col px-6 md:px-9 lg:w-[100vw] lg:px-12 xl:w-[1280px] xl:px-12 2xl:w-[1440px] 2xl:px-0">
          <h2 className="z-20 mb-2 text-4xl font-extrabold tracking-tighter text-neutral-100 md:text-4xl md:text-neutral-900 lg:mb-3 lg:w-4/7 xl:text-6xl 2xl:text-7xl">
            Redefined Elegance
          </h2>
          <p className="tracking mb-6 text-sm leading-loose text-neutral-200 sm:font-medium md:mb-6 md:w-[62%] md:text-base md:text-neutral-600 lg:mb-8 lg:w-3/5 lg:text-lg">
            Jewelry isn’t just worn — it speaks. At Regalia, every piece is
            crafted to elevate your style, reflect your essence, and become a
            part of your story.
          </p>
          {ctaText && (
            <button
              onClick={() => {
                navigate(ctaHref);
              }}
              className="inline-block w-fit cursor-pointer rounded-xl bg-neutral-300 px-4 py-2 text-sm font-semibold transition duration-300 hover:bg-black md:bg-neutral-800 md:px-6 md:py-2.5 md:text-base md:text-white"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
