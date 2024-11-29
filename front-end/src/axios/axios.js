import axios from "axios";


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 3000,
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
    config.headers["Authorization"] = token
      ? `Bearer ${token}`
      : delete config.headers["Authorization"];
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
    const { response } = error;
    console.log(response);
    if (response && (response.status === 401 || response.status === 403)) {
      // window.location.href = '/login';\

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
