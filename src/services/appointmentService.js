import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://authappapi.runasp.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to all requests
const addAuthToken = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

axiosInstance.interceptors.request.use(addAuthToken);

const appointmentService = {
    // Get all appointments for the current user (filtered by role)
    getAllAppointments: async () => {
        try {
            const response = await axiosInstance.get('/appointments');
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Get appointment by ID
    getAppointmentById: async (id) => {
        try {
            const response = await axiosInstance.get(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointment:', error);
            throw error;
        }
    },

    // Create new appointment (patients only)
    createAppointment: async (appointmentData) => {
        try {
            const response = await axiosInstance.post('/appointments', appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Update appointment
    updateAppointment: async (id, appointmentData) => {
        try {
            const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    },

    // Delete/cancel appointment
    deleteAppointment: async (id) => {
        try {
            const response = await axiosInstance.delete(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting appointment:', error);
            throw error;
        }
    },

    // Get booked slots for a doctor
    getDoctorBookedSlots: async (doctorId) => {
        try {
            const response = await axiosInstance.get(`/appointments/doctor/${doctorId}/booked-slots`);
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor booked slots:', error);
            throw error;
        }
    }
};

export default appointmentService; 