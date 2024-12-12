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
    // Thêm token từ localStorage vào request headers
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      console.error("API error response:", response);

      if (response.status === 401 || response.status === 403) {
        console.error("Authentication error - redirecting to login...");
        localStorage.removeItem("jwt"); // Xóa token nếu hết hạn
        window.location.href = "/login"; // Điều hướng về trang đăng nhập
      }
    } else {
      console.error("Network error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
