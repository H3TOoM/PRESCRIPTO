import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div id="speciality" className="flex flex-col items-center gap-6 py-20 text-gray-800 m-15">
      <h1 className="text-4xl font-bold">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-lg font-medium">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="flex sm:justify-center gap-6 pt-8 w-full flex-wrap">
        {specialityData.map((item , index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0,0)}
              className="flex flex-col items-center cursor-pointer flex-shirnk-0 hover:translate-y-[-10px] transition-all duration-500"
            >
                <img src={item.image} alt="" className="w-20 sm:w-28 mb-3 "/>
                <button
                  className="text-lg font-semibold px-6 py-2 rounded-full bg-[#5F6FFF] text-white shadow hover:bg-[#4a56d6] transition-all duration-300 border-none outline-none"
                  style={{minWidth: '200px'}}
                >
                  {item.speciality}
                </button>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
