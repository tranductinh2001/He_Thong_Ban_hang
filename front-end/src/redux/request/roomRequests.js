import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";


const roomRequests = {
  createModelInRoom: async (data) => {
    try {
      // Kiểm tra nếu data là FormData (để hỗ trợ upload multipart/form-data)
      if (data instanceof FormData) {
        // Hiển thị các giá trị trong FormData (phục vụ debug)
        for (const [key, value] of data.entries()) {
          console.log(`roomRequests Key: ${key}, Value:`, value);
        }
      } else {
        console.warn("Data provided is not a FormData instance.");
      }

      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_MODEL_IN_ROOM,
        data,
        {
          headers: {
            timeout: 5000,
            "Content-Type": data instanceof FormData
              ? "multipart/form-data"
              : "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      // Gọi hàm xử lý lỗi với thông báo cụ thể
      return errorHandler(error);
    }
  },
};

export default roomRequests;
