import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";


const roomRequests = {
  createModelInRoom: async (data) => {
    try {
      data.forEach((value, key) => {
        console.log(`roomRequests  Key: ${key}, Value:`, value);
      });      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_MODEL_IN_ROOM,
        data 
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  }
};

export default roomRequests;
