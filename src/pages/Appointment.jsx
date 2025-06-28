import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import appointmentService from "../services/appointmentService";
import doctorService from "../services/doctorService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const { t } = useTranslation();

  const [docInfo, setDocInfo] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocInfo = async () => {
    try {
      const doctor = await doctorService.getDoctorById(docId);
      setDocInfo(doctor);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      Swal.fire({ title: t("appointment_error_loading_doctor"), icon: "error" });
    }
  };

  const fetchAvailableDates = async () => {
    try {
      const dates = await appointmentService.getAvailableDates();
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
    }
  };

  const fetchAvailableTimeSlots = async (date) => {
    if (!docId || !date) return;
    try {
      const slots = await appointmentService.getAvailableTimeSlots(docId, date.date);
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
    }
  };

  useEffect(() => {
    fetchDocInfo();
    fetchAvailableDates();
  }, [docId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate);
      setSelectedTime(""); // Reset selected time when date changes
    }
  }, [selectedDate, docId]);

  const bookAppointment = async () => {
    if (!token) {
      Swal.fire({ icon: "error", title: t("appointment_oops"), text: t("appointment_login_first") });
      navigate('/login');
      return;
    }

    if (!selectedTime) {
      Swal.fire({ title: t("appointment_select_time_first"), icon: "warning" });
      return;
    }

    if (!selectedDate) {
      Swal.fire({ title: t("appointment_select_date_first"), icon: "warning" });
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        doctorId: parseInt(docId),
        appointmentDate: selectedDate.date,
        appointmentTime: selectedTime,
        notes: ""
      };

      await appointmentService.createAppointment(appointmentData);
      
      Swal.fire({ 
        title: t("appointment_booked_success"), 
        text: "Your appointment request has been sent to the doctor for approval.",
        icon: "success" 
      });
      setSelectedTime('');
      
      // Refresh available time slots
      await fetchAvailableTimeSlots(selectedDate);
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || t("appointment_failed_to_book");
      Swal.fire({ title: t("appointment_booking_failed"), text: errorMessage, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img src={docInfo.profilePictureUrl || docInfo.image} alt="" className="w-full sm:max-w-72 rounded-lg bg-[#5F6FFF]" />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 bg-gray-50 ml-2 sm:ml-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              {docInfo.fullName || docInfo.name}
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
                {t("appointment_about")} <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-semibold mt-4">
              {t("appointment_fee")} : <span className="text-gray-600">${docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 mt-4 font-semibold text-gray-700">
          <p className="mt-5 text-lg font-semibold">{t("appointment_booking_slots")}</p>

          {/* Day picker */}
          <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
            {availableDates.map((date, index) => (
              <div
                onClick={() => setSelectedDate(date)}
                key={index}
                className={`text-center py-6 px-4 rounded-full cursor-pointer 
                  ${selectedDate?.date === date.date
                    ? "bg-[#5F6FFF] text-gray-50 shadow-md shadow-[#5F6FFF]/50"
                    : "border border-gray-200 text-gray-500"
                  }`}
              >
                <p>{formatDate(date.date).split(',')[0]}</p>
                <p>{new Date(date.date).getDate()}</p>
                {date.isToday && <p className="text-xs mt-1">Today</p>}
              </div>
            ))}
          </div>

          {/* Time picker */}
          <div className="flex items-center gap-3 w-full overflow-x-auto mt-5">
            {availableTimeSlots.map((slot, index) => (
              <button
                key={index}
                disabled={!slot.isAvailable}
                onClick={() => {
                  if (slot.isAvailable) setSelectedTime(slot.time);
                }}
                className={`flex text-sm font-light px-8 items-center rounded-full border border-gray-200 
                    ${!slot.isAvailable
                    ? "bg-red-500 text-gray-50 cursor-not-allowed opacity-70 border-2 border-red-500"
                    : "cursor-pointer hover:bg-[#5F6FFF] hover:text-gray-50 transition ease-in-out duration-500"
                  }
                    ${slot.time === selectedTime ? "bg-[#5F6FFF] text-gray-50 shadow-md shadow-[#5F6FFF]/50" : ""}
                    `}
                title={!slot.isAvailable ? "This slot is already booked" : "Book this slot"}
              >
                {slot.displayTime}
              </button>
            ))}
          </div>

          <button
            onClick={bookAppointment}
            disabled={!selectedTime || loading}
            className="text-gray-50 text-sm px-14 py-3 rounded-full mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed 
            bg-[#5F6FFF] hover:shadow-md hover:shadow-[#5F6FFF]/50 transition-all duration-500 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-gray-400 disabled:hover:text-gray-50">
            {loading ? t("appointment_booking_loading") : t("appointment_book_button")}
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;

