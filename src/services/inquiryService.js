import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://authappapi.runasp.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create a separate instance for file uploads
const fileUploadInstance = axios.create({
    baseURL: 'https://authappapi.runasp.net/api',
    headers: {
        'Content-Type': 'multipart/form-data',
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
fileUploadInstance.interceptors.request.use(addAuthToken);

const inquiryService = {
    // Get all inquiries for the current user (filtered by role)
    getAllInquiries: async () => {
        try {
            const response = await axiosInstance.get('/inquiries');
            return response.data;
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            throw error;
        }
    },

    // Get inquiry by ID
    getInquiryById: async (id) => {
        try {
            const response = await axiosInstance.get(`/inquiries/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching inquiry:', error);
            throw error;
        }
    },

    // Create new inquiry (patients only)
    createInquiry: async (inquiryData) => {
        try {
            const response = await axiosInstance.post('/inquiries', inquiryData);
            return response.data;
        } catch (error) {
            console.error('Error creating inquiry:', error);
            throw error;
        }
    },

    // Submit consultation with files
    submitConsultation: async (consultationData) => {
        try {
            const formData = new FormData();
            formData.append('message', consultationData.message);
            
            if (consultationData.files && consultationData.files.length > 0) {
                consultationData.files.forEach(file => {
                    formData.append('files', file);
                });
            }

            const response = await fileUploadInstance.post('/inquiries/upload', formData);
            return response.data;
        } catch (error) {
            console.error('Error submitting consultation:', error);
            throw error;
        }
    },

    // Update inquiry (doctors/admins can respond)
    updateInquiry: async (id, updateData) => {
        try {
            const response = await axiosInstance.put(`/inquiries/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating inquiry:', error);
            throw error;
        }
    },

    // Delete inquiry
    deleteInquiry: async (id) => {
        try {
            const response = await axiosInstance.delete(`/inquiries/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting inquiry:', error);
            throw error;
        }
    }
};

export default inquiryService; 