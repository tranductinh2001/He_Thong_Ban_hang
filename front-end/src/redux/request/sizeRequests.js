import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const sizeRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_SIZE);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  getSizesByProductId: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_SIZE_BY_PRODUCT_ID(id));
      // console.log("getSizesByProductId ", response.data);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default sizeRequests;
