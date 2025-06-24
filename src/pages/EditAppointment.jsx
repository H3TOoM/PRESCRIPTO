import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import appointmentService from "../services/appointmentService";
import Swal from "sweetalert2";

const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
 ];

const EditAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    const [appointment] = useState(location.state.appointment);
    const [selectedTime, setSelectedTime] = useState(appointment.appointmentTime);
    const [selectedDate, setSelectedDate] = useState(appointment.appointmentDate.split('T')[0]);
    const [notes, setNotes] = useState(appointment.notes || "");
    const [loading, setLoading] = useState(false);

    if (!token) {
        navigate('/login');
        return null;
    }

    const handleSave = async () => {
        if (!selectedTime) {
            Swal.fire({ title: "Please select a time", icon: "warning" });
            return;
        }

        setLoading(true);

        try {
            const appointmentData = {
                appointmentDate: new Date(selectedDate + 'T' + selectedTime).toISOString(),
                appointmentTime: selectedTime,
                notes: notes
            };

            await appointmentService.updateAppointment(appointment.id, appointmentData);

            Swal.fire("Success!", "Appointment updated.", "success");
            navigate('/My-Appointment');
        } catch (error) {
            console.error('Error updating appointment:', error);
            const errorMessage = error.response?.data?.message || "Failed to update appointment";
            Swal.fire({ title: "Update Failed", text: errorMessage, icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 mt-12 max-w-4xl m-auto rounded-md shadow-md border border-gray-300">
            <h2 className="text-3xl font-semibold mb-6 text-gray-500">Edit Appointment</h2>

            <div className="flex items-center gap-6 mb-6 p-6 rounded-md shadow-inner">
                <img 
                    src={appointment.doctor?.profilePictureUrl || appointment.doctor?.image} 
                    alt="doctor" 
                    className="w-48 rounded-md shadow-md" 
                />
                <div className="flex-1">
                    <p className="text-gray-500 font-semibold text-2xl">
                        {appointment.doctor?.fullName || appointment.doctor?.name}
                    </p>
                    <p className="text-gray-500 mt-2">
                        {appointment.doctor?.speciality}
                    </p>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="date" className="block font-semibold mb-2 uppercase text-gray-500">
                    Appointment Date
                </label>
                <input
                    id="date"
                    type="date"
                    className="border border-gray-200 p-3 rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] text-gray-400"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="time" className="block font-semibold mb-2 uppercase text-gray-500">
                    Appointment Time
                </label>
                <select
                    id="time"
                    className="border border-gray-200 p-3 rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] text-gray-400"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                >
                    {availableTimes.map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="notes" className="block font-semibold mb-2 uppercase text-gray-500">
                    Notes (Optional)
                </label>
                <textarea
                    id="notes"
                    className="border border-gray-200 p-3 rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] text-gray-400"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    placeholder="Add any notes for your appointment..."
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={!selectedTime || loading}
                    className={`${
                        !selectedTime || loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#5F6FFF] hover:bg-[#4E5ACC]"
                    } text-gray-50 py-3 px-6 rounded-md font-semibold shadow-md transition ease-in-out duration-500`}
                >
                    {loading ? "Saving..." : "Save Appointment"}
                </button>

                <button
                    onClick={() => navigate('/My-Appointment')}
                    className="bg-gray-200 text-gray-900 py-3 px-6 rounded-md font-semibold shadow-md hover:bg-gray-300 transition ease-in-out duration-500">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditAppointment;

