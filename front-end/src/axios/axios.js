import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      // Nếu là FormData, dùng "multipart/form-data"
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      // Mặc định là JSON
      config.headers["Content-Type"] = "application/json";
    }
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      console.error("API error response:", response);

      if (response.status === 401 || response.status === 403) {
        // alert("Your session has expired. Please log in again.");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
