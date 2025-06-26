import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import appointmentService from "../services/appointmentService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [showCancelled, setShowCancelled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAppointments = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
      // Fetch cancelled appointments as well
      const cancelled = await appointmentService.getCancelledAppointments();
      setCancelledAppointments(cancelled);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Swal.fire({ title: t("myappointments_error_loading"), icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // cancel appointment function
  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: t("myappointments_cancel_confirm_title"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("myappointments_cancel_confirm_yes"),
      cancelButtonText: t("myappointments_cancel_confirm_no")
    });

    if (result.isConfirmed) {
      try {
        await appointmentService.deleteAppointment(appointmentId);
        // Remove from local state
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        Swal.fire(t("myappointments_cancelled_title"), t("myappointments_cancelled_text"), "success");
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        const errorMessage = error.response?.data?.message || t("myappointments_cancel_failed_text");
        Swal.fire({ title: t("myappointments_cancel_failed_title"), text: errorMessage, icon: "error" });
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="p-3 mt-12 font-semibold text-zinc-900 border-b border-gray-300">
          {t("myappointments_title")}
        </p>
        <div className="p-4 text-gray-500">{t("myappointments_loading")}</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-4">
        <p className="p-3 mt-12 font-semibold text-zinc-900 border-b border-gray-300">
          {t("myappointments_title")}
        </p>
        <div className="p-4 text-gray-500">{t("myappointments_login_prompt")}</div>
      </div>
    );
  }

  return (
    <div>
      <p className="p-3 mt-12 font-semibold text-zinc-900 border-b border-gray-300">
        {t("myappointments_title")}
      </p>
      {appointments.length === 0 && (
        <p className="p-4 text-gray-500">{t("myappointments_no_found")}</p>
      )}

      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 border-b border-gray-300 rounded-md shadow-md hover:shadow-lg transition-shadow duration-500"
        >
          <div className="p-3">
            <img 
              src={appointment.doctorImage} 
              alt="" 
              className="w-32 rounded-md" 
            />
          </div>
          <div className="flex-1 text-sm text-zinc-600">
            <p className="text-neutral-800 font-semibold mt-2">
              {appointment.doctorName}
            </p>
            <p>{appointment.doctorSpeciality}</p>
            <p className="text-zinc-700 font-semibold mt-1">{t("myappointments_address")}</p>
            <p className="text-xs">{appointment.doctorAddress}</p>
            <p className="text-sm mt-1 mb-2">
              <span className="text-sm text-neutral-700 font-semibold">
                {t("myappointments_date_time")}
              </span>
              {formatDate(appointment.appointmentDate)} | {formatTime(appointment.appointmentTime)}
            </p>
            {appointment.notes && (
              <p className="text-sm mt-1">
                <span className="text-neutral-700 font-semibold">{t("myappointments_notes")}</span>
                {appointment.notes}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 justify-end font-semibold items-center">
            <button
              className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-gray-50 transition-all duration-500"
              onClick={() =>
                navigate('/edit-appointment', { state: { appointment } })
              }
            >
              {t("myappointments_edit_btn")}
            </button>
            <button
              onClick={() => handleCancelAppointment(appointment.id)}
              className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-gray-50 transition-all duration-500">
              {t("myappointments_cancel_btn")}
            </button>
            <button className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-gray-50 transition-all duration-500">
              {t("myappointments_pay_btn")}
            </button>
          </div>
        </div>
      ))}

      {/* Collapsible Cancelled Appointments Section */}
      <div className="mt-8">
        <button
          onClick={() => setShowCancelled(v => !v)}
          className="flex items-center gap-2 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
        >
          {showCancelled ? "▼" : "►"} {t("myappointments_show_cancelled")}
        </button>
        {showCancelled && (
          <div className="mt-4">
            {cancelledAppointments.length === 0 ? (
              <p className="text-gray-500">{t("myappointments_no_cancelled")}</p>
            ) : (
              cancelledAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 border-b border-gray-200 rounded-md bg-red-50"
                >
                  <div className="p-3">
                    <img 
                      src={appointment.doctorImage} 
                      alt="" 
                      className="w-32 rounded-md" 
                    />
                  </div>
                  <div className="flex-1 text-sm text-zinc-600">
                    <p className="text-neutral-800 font-semibold mt-2">
                      {appointment.doctorName}
                    </p>
                    <p>{appointment.doctorSpeciality}</p>
                    <p className="text-zinc-700 font-semibold mt-1">{t("myappointments_address")}</p>
                    <p className="text-xs">{appointment.doctorAddress}</p>
                    <p className="text-sm mt-1 mb-2">
                      <span className="text-sm text-neutral-700 font-semibold">
                        {t("myappointments_date_time")}
                      </span>
                      {formatDate(appointment.appointmentDate)} | {formatTime(appointment.appointmentTime)}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm mt-1">
                        <span className="text-neutral-700 font-semibold">{t("myappointments_notes")}</span>
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;

