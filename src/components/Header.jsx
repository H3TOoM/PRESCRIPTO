import React from "react";
import { assets } from "../assets/assets";
import { FaMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20 bg-[#5F6FFF]">
      {/* The Left Side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-4xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight heading" dangerouslySetInnerHTML={{ __html: t("header_title") }} />
        <div className="flex flex-col md:flex-row items-cenetr gap-3 text-white text-sm font-light">
          <img src={assets.group_profiles} alt="" className="w-30" />
          <p>
            {t("header_subtitle")}
          </p>
        </div>
        <a href="#speciality" className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transtion-all duration-300">
          {t("header_btn")} <img src={assets.arrow_icon} alt="" className="w-3" />
        </a>
      </div>
      {/* The Right Side */}
      <div className="md:w-1/2 relative">
        <img
          src={assets.header_img}
          alt=""
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default Header;
