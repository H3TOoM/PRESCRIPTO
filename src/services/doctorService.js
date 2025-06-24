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

const doctorService = {
    // Get all doctors (public endpoint)
    getAllDoctors: async () => {
        try {
            const response = await axiosInstance.get('/doctors');
            return response.data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    },

    // Get doctor by ID
    getDoctorById: async (id) => {
        try {
            const response = await axiosInstance.get(`/doctors/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            throw error;
        }
    },

    // Get doctors by specialty (client-side filtering)
    getDoctorsBySpecialty: async (specialty) => {
        try {
            const response = await axiosInstance.get('/doctors');
            const allDoctors = response.data;
            // Filter doctors by specialty on the client side
            const filteredDoctors = allDoctors.filter(doctor => 
                doctor.speciality && doctor.speciality.toLowerCase().includes(specialty.toLowerCase())
            );
            return filteredDoctors;
        } catch (error) {
            console.error('Error fetching doctors by specialty:', error);
            throw error;
        }
    },

    // Get all available specialties
    getSpecialties: async () => {
        try {
            const response = await axiosInstance.get('/doctors');
            const allDoctors = response.data;
            // Extract unique specialties
            const specialties = [...new Set(allDoctors.map(doctor => doctor.speciality).filter(Boolean))];
            return specialties;
        } catch (error) {
            console.error('Error fetching specialties:', error);
            throw error;
        }
    },

    // Admin functions (require admin role)
    createDoctor: async (doctorData) => {
        try {
            const response = await axiosInstance.post('/doctors', doctorData);
            return response.data;
        } catch (error) {
            console.error('Error creating doctor:', error);
            throw error;
        }
    },

    updateDoctor: async (id, doctorData) => {
        try {
            const response = await axiosInstance.put(`/doctors/${id}`, doctorData);
            return response.data;
        } catch (error) {
            console.error('Error updating doctor:', error);
            throw error;
        }
    },

    deleteDoctor: async (id) => {
        try {
            const response = await axiosInstance.delete(`/doctors/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting doctor:', error);
            throw error;
        }
    }
};

export default doctorService; 