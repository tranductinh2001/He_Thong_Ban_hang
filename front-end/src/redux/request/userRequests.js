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
  },UserDetail: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER_DETAIL);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
};

export default userRequests;
