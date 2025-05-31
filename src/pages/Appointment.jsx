import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
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

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

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

  // هذا دالة حفظ الحجز عند الضغط على زر الحجز
  const bookAppointment = () => {
    if (!slotTime) {
      Swal.fire({
        title: "Please select a time slot first!",
        icon: "warning",
      });
      return;
    }

    const selectedSlot = docSlots[slotIndex].find((s) => s.time === slotTime);

    if (!selectedSlot) {
      Swal.fire({
        title: "Selected slot not found!",
        icon: "error",
      });
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
      Swal.fire({
        title: "Booked Successfully!",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "This appointment is already booked.",
        icon: "info",
      });
    }
  };

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo.image}
              alt=""
              className="w-full sm:max-w-72 rounded-lg bg-[#5F6FFF] blur-xs"
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
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
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee :{" "}
              <span className="text-gray-600">${docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 mt-4 font-medium text-gray-700">
          <p className="mt-5 text-lg font-semibold ">Booking Slots</p>
          <div className="flex gap-3 items-center w-full over-flow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((daySlots, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
                      ? "bg-[#5F6FFF] text-white"
                      : "border border-gray-200"
                    }`}
                >
                  <p>{daySlots[0] && daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                  <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-5">
            {docSlots.length &&
              docSlots[slotIndex].map((slot, index) => (
                <div
                  onClick={() => setSlotTime(slot.time)}
                  key={index}
                  className={`flex text-sm font-light flex-shrink-0 px-8 items-center rounded-full cursor-pointer border border-gray-200 ${slot.time === slotTime ? "bg-[#5F6FFF] text-white" : "text-color-gray"
                    }`}
                >
                  {slot.time.toUpperCase()}
                </div>
              ))}
          </div>


          <button
            onClick={bookAppointment}
            className="text-white text-sm px-14 py-3 rounded-full mt-8 cursor-pointer uppercase bg-[#5F6FFF] hover:scale-[1.02] transition-all duration-300"
          >
            Book an appointment
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
