/* eslint-disable no-unused-vars */
import axios from "axios";
import { isRefTokenExp, isTokenExpired } from "./isTokenExpired";

export const axiosInstance = axios.create({
    baseURL: 'https://api.binsapp.ai/'
});

// Request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        const token = window.localStorage.getItem('accessToken');

        if (token && isTokenExpired(token)) {
            originalRequest._retry = true;
            const refreshToken = window.localStorage.getItem('refreshToken');
            if (refreshToken && !isRefTokenExp(refreshToken)) {
                try {
                    const response = await axiosInstance.post(`Authentication/refresh-token`, { refreshToken: refreshToken });
                    if (response.status === 200) {
                        const newAccessToken = response.data.accessToken;
                        localStorage.setItem('accessToken', newAccessToken);
                        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                        return axiosInstance(originalRequest);
                    }
                } catch (tokenRefreshError) {
                    if (tokenRefreshError.response && tokenRefreshError.response.status === 401) {
                        window.localStorage.removeItem('refreshToken');
                        window.localStorage.removeItem('data');
                        window.localStorage.removeItem('accessToken');
                        window.localStorage.removeItem('login_apex');
                        window.localStorage.removeItem('user_role_data');
                        window.location.href = '/login';
                        return Promise.reject('Refresh token expired');
                    }
                    return Promise.reject(tokenRefreshError);
                }
            } else {
                window.localStorage.removeItem('refreshToken');
                window.localStorage.removeItem('data');
                window.localStorage.removeItem('accessToken');
                window.localStorage.removeItem('login_apex');
                window.localStorage.removeItem('user_role_data');
                window.location.href = '/login';
                return Promise.reject('Refresh token expired');
            }
        }
        return Promise.reject(error);
    }
);
