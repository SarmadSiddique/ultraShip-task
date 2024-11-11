import axios from 'axios';

export const axiosInstanceStudent = axios.create({
    baseURL: 'https://ultra-backend-v50e.onrender.com/',
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
        return Promise.reject(error);
    }
);
axiosInstanceStudent.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);
export default axiosInstanceStudent;
