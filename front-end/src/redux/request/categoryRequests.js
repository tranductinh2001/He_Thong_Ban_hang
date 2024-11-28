import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const categoryRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_CATEGORY);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  create: async (body) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CREATE_CATEGORY, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (categoryId, body) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_CATEGORY}${categoryId}`, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (categoryId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_CATEGORY}?id=${categoryId}`);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default categoryRequests;
