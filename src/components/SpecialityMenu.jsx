import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SpecialityMenu = () => {
  const { t } = useTranslation();
  return (
    <div id="speciality" className="flex flex-col items-center gap-4 py-16 text-gray-800 m-15">
      <h1 className="text-3xl font-medium">{t("speciality_title")}</h1>
      <p className="sm:w-1/3 text-center text-sm">
        {t("speciality_subtitle")}
      </p>
      <div className="flex sm:justify-center gap-6 pt-8 w-full flex-wrap">
        {specialityData.map((item , index) => (
            <Link key={index} to={`/doctors/${item.speciality}`} onClick={() => scrollTo(0,0)} className=" flex flex-col items-center text-xs cursor-pointer flex-shirnk-0 hover:translate-y-[-10px] transition-all duration-500">
                <item.image  alt="" className="w-16 sm:w-24 mb-2 "/>
                <p className="text-sm text-center special-desc">{t(`speciality_${item.speciality}`)}</p>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;