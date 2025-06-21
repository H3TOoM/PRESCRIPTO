import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("selectedAppointments");

    setAppointments(JSON.parse(stored) || []);
  }, []);

  // cancel appointment function
  const handleCancelAppointment = (index) => {
    Swal.fire({
      title: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAppointments = [...appointments];
        updatedAppointments.splice(index, 1);
        localStorage.setItem("selectedAppointments", JSON.stringify(updatedAppointments));

        setAppointments(updatedAppointments);

        Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success");

      }
    });
  };

  return (
    <div>
      <p className="p-3 mt-12 font-semibold text-zinc-900 border-b border-gray-300">
        My appointments
      </p>
      {appointments.length === 0 && (
        <p className="p-4 text-gray-500">No appointments found.</p>
      )}

      {appointments.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 border-b border-gray-300 rounded-md shadow-md hover:shadow-lg transition-shadow duration-500"
        >
          <div className="p-3">
            <img src={item.doctor.image} alt="" className="w-32 rounded-md" />
          </div>
          <div className="flex-1 text-sm text-zinc-600">
            <p className="text-neutral-800 font-semibold mt-2">
              {item.doctor.name}
            </p>
            <p>{item.doctor.speciality}</p>
            <p className="text-zinc-700 font-semibold mt-1">Address : </p>
            <p className="text-xs">{item.doctor.address?.line1}</p>
            <p className="text-xs">{item.doctor.address?.line2}</p>
            <p className="text-sm mt-1 mb-2">
              <span className="text-sm text-neutral-700 font-semibold">
                Date & Time:{" "}
              </span>
              {item.appointment.date} | {item.appointment.time}
            </p>
          </div>
          <div className="flex flex-col gap-2 justify-end font-semibold items-center">
            <button
              className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-gray-50 transition-all duration-500"
              onClick={() =>
                navigate('/edit-appointment', { state: { item, index } })
              }
            >
              Edit Appointment
            </button>
            <button
              onClick={() => handleCancelAppointment(index)}
              className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-gray-50 transition-all duration-500">
              Cancel Appointment
            </button>
            <button className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-gray-50 transition-all duration-500">
              Pay Online
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointment;

