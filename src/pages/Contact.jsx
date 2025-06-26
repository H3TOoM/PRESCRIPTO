import React from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p dangerouslySetInnerHTML={{ __html: t("contact_title") }} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          src={assets.contact_image}
          alt=""
          className="w-full md:max-w-[360px]"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">{t("contact_office")}</p>
          <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: t("contact_address") }} />
          <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: t("contact_tel") }} />
          <p className="font-semibold text-lg text-gray-600">{t("contact_careers")}</p>
          <p className="text-gray-500">{t("contact_careers_desc")}</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transtion-all duration-500">
            {t("contact_explore_jobs")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
