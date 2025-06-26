import React, { useEffect, useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import doctorService from "../services/doctorService";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

const TopDoctor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const {doctors} = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Swal.fire({ title: "Error loading doctors", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchDoctors()
  },[])

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium ">{t("topdoctor_title")}</h1>
      <p className="sm:w-1/3 text-center text-sm">
        {t("topdoctor_subtitle")}
      </p>
      <div className="w-full grid gap-6 pt-5 g-y-6 px-3 sm:px-0 top-doctor-container">
        {doctors.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-500"
            onClick={() => {navigate(`/appointment/${item._id}`) ; scrollTo(0,0)}}
          >
            <img src={item.image} alt="" className="bg-blue-50" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>{t("topdoctor_available")}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.firstName +" "+ item.lastName}</p>
              <p className="text-gray-600 text-xs">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="bg-green-50 rounded-full text-gray mt-10 text-center px-12 py-3 cursor-pointer" onClick={()=> {navigate('/doctors'); scrollTo(0,0)}}>
        {t("topdoctor_more")}
      </button>
    </div>

  );
};

export default TopDoctor;
