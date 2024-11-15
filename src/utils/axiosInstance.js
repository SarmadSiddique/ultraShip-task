/* eslint-disable no-unused-vars */
import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: 'https://api.binsapp.ai/'
});

axiosInstance.interceptors.request.use(
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


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);
