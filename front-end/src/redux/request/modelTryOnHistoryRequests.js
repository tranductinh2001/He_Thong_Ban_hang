import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const modelTryOnHistoryRequests = {
  getByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GET_MODEL_TRY_ON_HISTORY_BY_USER_ID}/${userId}`
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (modelTryOnHistoryId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_MODEL_TRY_ON_HISTORY}/${modelTryOnHistoryId}`
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default modelTryOnHistoryRequests;
