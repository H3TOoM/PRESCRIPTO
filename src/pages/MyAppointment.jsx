import React, { useEffect, useState } from "react";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedAppointments");
    const parsed = JSON.parse(stored) || [];
    setAppointments(parsed);
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
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAppointments = [...appointments];
        updatedAppointments.splice(index, 1); //  cancel the selected appointment

        localStorage.setItem(
          "selectedAppointments",
          JSON.stringify(updatedAppointments)
        );

        setAppointments(updatedAppointments);

        Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success");
      }
    });
  };

  return (
    <div>
      <p className="pd-3 mt-12 font-medium text-zinc-700 border-b border-gray-300">
        My appointments
      </p>
      {appointments.length === 0 && (
        <p className="p-4 text-gray-500">No appointments found.</p>
      )}
      {appointments.map((item, index) => (
        <div
          key={index}
          className="grid grid-col-[1fr_2fr] gap-4 sm:flex sm:gap-6 border-b border-gray-300"
        >
          <div className="p-3">
            <img
              src={item.doctor.image}
              alt=""
              className="w-32 bg-indigo-50 blur-xs"
            />
          </div>
          <div className="flex-1 text-sm text-zinc-600">
            <p className="text-neutral-800 font-semibold mt-2">{item.doctor.name}</p>
            <p>{item.doctor.speciality}</p>
            <p className="text-zinc-700 font-medium mt-1">Address : </p>
            <p className="text-xs">{item.doctor.address?.line1}</p>
            <p className="text-xs">{item.doctor.address?.line2}</p>
            <p className="text-sm mt-1 mb-2">
              <span className="text-sm text-neutral-700 font-medium">
                Date & Time:{" "}
              </span>
              {item.appointment.date} | {item.appointment.time}
            </p>
          </div>
          <div className="flex flex-col gap-2 justify-end font-medium">
            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-white transition-all duration-300">
              Pay Online
            </button>
            <button
              onClick={() => handleCancelAppointment(index)}
              className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-600"
            >
              Cancel appointment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointment;
