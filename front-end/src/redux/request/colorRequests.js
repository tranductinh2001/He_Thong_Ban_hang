import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const colorRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_COLOR);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  create: async (body) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CREATE_COLOR, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (colorId, body) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_COLOR}${colorId}`, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (colorId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_COLOR}/${colorId}`);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default colorRequests;
