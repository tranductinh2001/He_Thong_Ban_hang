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
  }
};

export default userRequests;
