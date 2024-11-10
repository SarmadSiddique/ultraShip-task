// axiosInstance.js
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};
const GoogleApiKey = "AIzaSyD4qhOSy-gRNAwJ1l3952qY2K4sMTIGOHQ";
const axiosInstance = axios.create({
  baseURL: "https://api.binsapp.ai/", // Replace with your API's base URL
});

// Set the x-auth-token header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("admin_token"); // Adjust this according to where you store your token
    if (token) {
      config.headers["x-auth-token"] =
        window.localStorage.getItem("admin_token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { headers };
export { GoogleApiKey };
export default axiosInstance;
