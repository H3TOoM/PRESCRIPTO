import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

    const [item] = useState(location.state.item);
    const [selectedTime, setSelectedTime] = useState(item.appointment.time);
    const [selectedDate, setSelectedDate] = useState(item.appointment.date);
    const [filteredTimes, setFilteredTimes] = useState(availableTimes);

    useEffect(() => {
        // Filter available times based on the selected date
        const appointments = JSON.parse(localStorage.getItem("selectedAppointments")) || [];

        // Exclude the current appointment
        const otherAppointments = appointments.filter((_, idx) => idx !== location.state.index);

        // Gather reserved slots for the selected date
        const reserved = otherAppointments
            .filter((item) => item.appointment.date === selectedDate)
            .map((item) => item.appointment.time);

        // Filter out reserved slots
        setFilteredTimes(availableTimes.filter((time) => !reserved.includes(time)));
    }, [selectedDate, item, location.state.index]);

    const handleSave = () => {
        // Store updated appointment in LocalStorage
        const appointments = JSON.parse(localStorage.getItem("selectedAppointments")) || [];

        appointments[location.state.index] = {
            ...item,
            appointment: {
                date: selectedDate,
                time: selectedTime,
            },
        };

        localStorage.setItem("selectedAppointments", JSON.stringify(appointments));

        Swal.fire("Success!", "Appointment updated.", "success");

        navigate('/My-Appointment');
    };

    return (
        <div className="p-6 mt-12 max-w-4xl m-auto rounded-md shadow-md border border-gray-300">
            <h2 className="text-3xl font-semibold mb-6 text-gray-500">Edit Appointment</h2>

            <div className="flex items-center gap-6 mb-6 p-6 rounded-md shadow-inner">
                <img src={item.doctor.image} alt="doctor" className="w-48 rounded-md shadow-md" />
                <div className="flex-1">
                    <p className="text-gray-500 font-semibold text-2xl">
                        {item.doctor.name}
                    </p>
                    <p className="text-gray-500 mt-2">
                        {item.doctor.speciality}
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
                    {filteredTimes.length > 0 ? (
                        filteredTimes.map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))
                    ) : (
                        <option disabled>Not available</option>
                    )}

                </select>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={!selectedTime}
                    className={`${
                        !selectedTime ? "bg-gray-400 cursor-not-allowed" : "bg-[#5F6FFF] hover:bg-[#4E5ACC]"
                    } text-gray-50 py-3 px-6 rounded-md font-semibold shadow-md transition ease-in-out duration-500`}
                >
                    Save Appointment
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

