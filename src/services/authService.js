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

const authService = {
    // Authentication
    register: async (userData) => {
        const response = await axiosInstance.post('/register', userData);
        return response.data;
    },
    verifyOtp: async (verificationData) => {
        const response = await axiosInstance.post('/verify-otp', verificationData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await axiosInstance.post('/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post('/logout');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await axiosInstance.get('/user');
        return response.data;
    },

    // Account Management
    changeEmail: async (changeEmailData) => {
        try {
            const response = await axiosInstance.post('/change-email', changeEmailData);
            console.log('Change email response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error changing email:', error);
            throw error;
        }
    },

    // Profile Picture Management
    uploadProfilePicture: async (file) => {
        try {
            const formData = new FormData();
            formData.append('Picture', file);

            const response = await fileUploadInstance.post('/profile-pictures/upload', formData);

            return response.data;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw error;
        }
    },

    getCurrentProfilePicture: async () => {
        try {
            const response = await axiosInstance.get('/profile-pictures/current');
            return response.data;
        } catch (error) {
            console.error('Error getting current profile picture:', error);
            throw error;
        }
    },

    // Profile Management
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.patch('/me', profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.post('/reset-password', passwordData);
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
};

export default authService;