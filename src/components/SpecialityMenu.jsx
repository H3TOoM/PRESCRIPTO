import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SpecialityMenu = () => {
  const { t } = useTranslation();
  return (
    <div id="speciality" className="flex flex-col items-center gap-6 py-20 text-gray-800 m-15">
      <h1 className="text-4xl font-bold">{t("speciality_title")}</h1>
      <p className="sm:w-1/3 text-center text-lg font-medium">
        {t("speciality_subtitle")}
      </p>
      <div className="flex sm:justify-center gap-6 pt-8 w-full flex-wrap">
        {specialityData.map((item , index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0,0)}
              className="flex flex-col items-center cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
              style={{ minWidth: 160 }}
            >
                <div className="flex items-center justify-center rounded-full bg-[#e6edfa] mb-3" style={{ width: 90, height: 90 }}>
                  {typeof item.image === 'function' ? (
                    React.createElement(item.image, { className: "w-14 h-14 object-contain" })
                  ) : (
                    <img src={item.image} alt="" className="w-14 h-14 object-contain" />
                  )}
                </div>
                <button
                  className="text-md font-semibold px-6 py-2 rounded-full bg-[#5F6FFF] text-white shadow hover:bg-[#4a56d6] transition-all duration-300 border-none outline-none"
                  style={{minWidth: '160px'}}
                >
                  {t(`speciality_${item.speciality}`)}
                </button>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;