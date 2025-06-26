import React, { use, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Banner = () => {
  const navigate = useNavigate();
  const {token} = useContext(AppContext)
  return (
    <div className="flex bg-[#5F6FFF] rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 ">
      {/* left side */}
      <div className="flex-1 py-8 sm:py-16 lg:py-24 lg:pl-5">
        <div className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p className="mt-2">Book Appointment </p>
          <p>With 100+ Trusted Doctors</p>
        </div>
        {!token ? <button
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-5 hover:scale-105 transition-all cursor-pointer"
          onClick={() => {
            navigate("login");
            scrollTo(0, 0);
          }}
        >
          Create account
        </button> : null}
      </div>

      {/* right side */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          src={assets.appointment_img}
          alt=""
          className="w-full bottom-0 absolute right-0 max-w-md"
        />
      </div>
    </div>
  );
};

export default Banner;
