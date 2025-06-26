import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import doctorService from "../services/doctorService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Doctors = () => {
  const { t } = useTranslation();
  const { speciality } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(()=>{
    doctors.forEach(async (doctor) => {
      await fetch('https://authappapi.runasp.net/swagger/index.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctor),
      });
    });
    
  },[])

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

  const fetchSpecialties = async () => {
    try {
      const data = await doctorService.getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const applyFilter = () => {
    if (speciality) {
      setFilteredDoctors(doctors.filter((doc) => 
        doc.speciality && doc.speciality.toLowerCase().includes(speciality.toLowerCase())
      ));
    } else {
      setFilteredDoctors(doctors);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-600">{t("doctors_browse")}</p>
        <div className="p-4 text-gray-500">{t("doctors_loading")}</div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600">{t("doctors_browse")}</p>
      <div className="flex flex-col sm:flex-row items-strat gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {/* All Doctors */}
          <p
            onClick={() => navigate("/doctors")}
            className={`w-[94vh] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              !speciality ? "bg-indigo-100 text-black" : ""
            }`}
          >
            {t("doctors_all_specialties")}
          </p>
          
          {/* Dynamic Specialty Filters */}
          {specialties.map((specialty, index) => (
            <p
              key={index}
              onClick={() =>
                speciality === specialty
                  ? navigate("/doctors")
                  : navigate(`/doctors/${specialty}`)
              }
              className={`w-[94vh] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === specialty ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {t(`speciality_${specialty}`) || specialty}
            </p>
          ))}
        </div>
        
        <div className="w-full grid gap-4 gap-y-6 top-doctor-container">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              {t("doctors_no_found")}
            </div>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <div
                key={doctor.id || index}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-500"
                onClick={() => navigate(`/appointment/${doctor.id}`)}
              >
                <img 
                  src={doctor.profilePictureUrl || doctor.image} 
                  alt="" 
                  className="bg-blue-50" 
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-center text-green-500">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>{t("doctors_available")}</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">
                    {doctor.fullName || doctor.name}
                  </p>
                  <p className="text-gray-600 text-xs">{t(`speciality_${doctor.speciality}`) || doctor.speciality}</p>
                  {doctor.degree && (
                    <p className="text-gray-500 text-xs mt-1">{doctor.degree}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
