import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const userRequests = {
  GetUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_USER_BY_ID(userId)
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  UpdateUser: async (userId, data) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_USER(userId),
        data
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_USER);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (userId, body) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_USER}/${userId}`, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (userId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_USER}?id=${userId}`);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default userRequests;
