import axios from 'axios';
const apiUrl = " https://ultra-backend-v50e.onrender.com/";
export const axiosInstanceStudent = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstanceStudent.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem('accessToken');
        console.log('Token retrieved from localStorage:', token);

        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);
axiosInstanceStudent.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('API Error:', errorMessage);
        return Promise.reject(error);
    }
);

export default axiosInstanceStudent;
