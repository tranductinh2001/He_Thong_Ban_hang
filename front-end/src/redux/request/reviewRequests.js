import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const reviewRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_REVIEW);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  create: async (body) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CREATE_REVIEW, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (reviewId, body) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_REVIEW}${reviewId}`, body);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (reviewId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_REVIEW}?id=${reviewId}`);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default reviewRequests;