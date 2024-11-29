import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const imageRequests = {
  upload: async (formData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD_IMAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default imageRequests;
