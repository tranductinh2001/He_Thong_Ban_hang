import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const serviceRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_SERVICE);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  create: async (body) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_SERVICE,
        body
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (serviceId, body) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.UPDATE_SERVICE}${serviceId}`,
        body
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (serviceId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_SERVICE}?id=${serviceId}`
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default serviceRequests;
