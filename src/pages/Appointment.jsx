import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, token } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  const getAvailableSlots = () => {
    setDocSlots([]);

    let today = new Date();
    let slotsByDay = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slotsByDay.push(timeSlots);
    }

    setDocSlots(slotsByDay);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  const bookAppointment = () => {
    if (token) {
      if (!slotTime) {
        Swal.fire({ title: "Please select a time slot first!", icon: "warning" });
        return;
      }

      const selectedSlot = docSlots[slotIndex].find((s) => s.time === slotTime);

      if (!selectedSlot) {
        Swal.fire({ title: "Selected slot not found!", icon: "error" });
        return;
      }

      const newBooking = {
        doctor: docInfo,
        appointment: {
          date: selectedSlot.datetime.toDateString(),
          time: selectedSlot.time,
          iso: selectedSlot.datetime.toISOString(),
        },
      };

      const existingBookings = JSON.parse(localStorage.getItem("selectedAppointments")) || [];

      const isAlreadyBooked = existingBookings.some(
        (booking) =>
          booking.doctor._id === newBooking.doctor._id &&
          booking.appointment.iso === newBooking.appointment.iso
      );

      if (!isAlreadyBooked) {
        existingBookings.push(newBooking);
        localStorage.setItem("selectedAppointments", JSON.stringify(existingBookings));

        Swal.fire({ title: "Booked Successfully!", icon: "success" });
        setSlotTime('');
      } else {
        Swal.fire({ title: "This appointment is already booked.", icon: "info" });
      }
    } else {
      Swal.fire({ icon: "error", title: "Oops!", text: "Please Login First" });
      navigate('/login');
    }
  };

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img src={docInfo.image} alt="" className="w-full sm:max-w-72 rounded-lg bg-[#5F6FFF]" />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 bg-gray-50 ml-2 sm:ml-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              {docInfo.name}
              <img src={assets.verified_icon} alt="" className="w-5" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-semibold mt-4">
              Appointment fee : <span className="text-gray-600">${docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 mt-4 font-semibold text-gray-700">
          <p className="mt-5 text-lg font-semibold">Booking Slots</p>

          {/* Day picker */}
          <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
            {docSlots.length &&
              docSlots.map((daySlots, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 px-4 rounded-full cursor-pointer 
                    ${slotIndex === index
                      ? "bg-[#5F6FFF] text-gray-50 shadow-md shadow-[#5F6FFF]/50"
                      : "border border-gray-200 text-gray-500"
                    }`}
                >
                  <p>{daySlots[0] && daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                  <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          {/* Time picker */}
          <div className="flex items-center gap-3 w-full overflow-x-auto mt-5">
            {docSlots.length &&
              docSlots[slotIndex].map((slot, index) => {
                // Check if slot is booked
                const existingBookings = JSON.parse(localStorage.getItem("selectedAppointments")) || [];

                const isBooked = existingBookings.some(
                  (booking) =>
                    booking.doctor._id === docInfo._id &&
                    booking.appointment.iso === slot.datetime.toISOString()
                );

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (!isBooked) setSlotTime(slot.time);
                    }}
                    className={`flex text-sm font-light px-8 items-center rounded-full border border-gray-200 
                        ${isBooked
                        ? "bg-red-500 text-gray-50 cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-[#5F6FFF] hover:text-gray-50 transition ease-in-out duration-500"
                      }
                        ${slot.time === slotTime ? "bg-[#5F6FFF] text-gray-50 shadow-md shadow-[#5F6FFF]/50" : ""}
                        `}
                  >
                    {slot.time.toUpperCase()}
                  </div>
                )
              })}
          </div>

          <button
            onClick={bookAppointment}
            disabled={!slotTime}
            className="text-gray-50 text-sm px-14 py-3 rounded-full mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed 
            bg-[#5F6FFF] hover:shadow-md hover:shadow-[#5F6FFF]/50 transition-all duration-500 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-gray-400 disabled:hover:text-gray-50">
            Book an Appointment
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;

