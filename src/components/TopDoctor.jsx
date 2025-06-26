import React, { useContext } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctor = () => {
  const navigate = useNavigate();
  const { doctors, loadingDoctors } = useContext(AppContext);

  if (loadingDoctors || !doctors || doctors.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium ">Top Doctors To Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid gap-3 pt-5 g-y-6 px-3 sm:px-0 top-doctor-container">
        {doctors.slice(0, 8).map((item, index) => (
          <div
            key={item._id || index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-500"
            onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0);}}
          >
            <img src={item.profilePictureUrl || item.image} alt="" className="bg-blue-50" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.fullName || item.name}</p>
              <p className="text-gray-600 text-xs">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="bg-green-50 rounded-full text-gray mt-10 text-center px-12 py-3 cursor-pointer" onClick={()=> {navigate('/doctors'); scrollTo(0,0)}}>
        more
      </button>
    </div>
  );
};

export default TopDoctor;
