import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const statisticRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_STATISTIC_ALL);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default statisticRequests;
