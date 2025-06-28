import React from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p dangerouslySetInnerHTML={{ __html: t("about_title") }} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          src={assets.about_image}
          alt=""
          className="w-full md:max-w-[360px]"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>{t("about_welcome")}</p>
          <p>{t("about_commitment")}</p>
          <b className="text-gray-800">{t("about_vision_title")}</b>
          <p>{t("about_vision")}</p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p dangerouslySetInnerHTML={{ __html: t("about_why_title") }} />
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border border-gray-200 px-10 md:px-15 py-8 sm:py-16 flex flex-col gap-4 text-[15px] hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 cursor-pointer">
          <b>{t("about_efficiency_title")}</b>
          <p>{t("about_efficiency")}</p>
        </div>
        <div className="border border-gray-200 px-10 md:px-15 py-8 sm:py-16 flex flex-col gap-4 text-[15px] hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 cursor-pointer">
          <b>{t("about_convenience_title")}</b>
          <p>{t("about_convenience")}</p>
        </div>
        <div className="border border-gray-200 px-10 md:px-15 py-8 sm:py-16 flex flex-col gap-4 text-[15px] hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 cursor-pointer">
          <b>{t("about_personalization_title")}</b>
          <p>{t("about_personalization")}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
