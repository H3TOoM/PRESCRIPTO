import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorService from "../services/doctorService";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate = useNavigate();
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedDoctors = async () => {
      if (!speciality) {
        setLoading(false);
        return;
      }

      try {
        const allDoctors = await doctorService.getAllDoctors();
        const filteredDoctors = allDoctors.filter(
          (doc) => doc.speciality === speciality && doc.id !== docId
        );
        setRelatedDoctors(filteredDoctors);
      } catch (error) {
        console.error('Error fetching related doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedDoctors();
  }, [speciality, docId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
        <h1 className="text-3xl font-medium">Related Doctors</h1>
        <p className="sm:w-1/3 text-center text-sm">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="w-full text-center py-8 text-gray-500">
          Loading related doctors...
        </div>
      </div>
    );
  }

  if (relatedDoctors.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid gap-3 pt-5 g-y-6 px-3 sm:px-0 top-doctor-container">
        {relatedDoctors.slice(0, 5).map((doctor, index) => (
          <div
            key={doctor.id || index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-500"
            onClick={() => {
              navigate(`/appointment/${doctor.id}`);
              scrollTo(0, 0);
            }}
          >
            <img 
              src={doctor.profilePictureUrl || doctor.image} 
              alt="" 
              className="bg-blue-50 blur-sm" 
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">
                {doctor.fullName || doctor.name}
              </p>
              <p className="text-gray-600 text-xs">{doctor.speciality}</p>
              {doctor.degree && (
                <p className="text-gray-500 text-xs mt-1">{doctor.degree}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
