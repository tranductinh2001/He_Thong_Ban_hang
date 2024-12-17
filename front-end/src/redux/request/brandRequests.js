import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const brandRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_BRAND);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  create: async (body) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CREATE_BRAND, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (brandId, body) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_BRAND}${brandId}`, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (brandId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_BRAND}/${brandId}`);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default brandRequests;
