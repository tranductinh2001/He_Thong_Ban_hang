import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const contactRequests = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_CONTACT);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  sendMail: async (mailData) => {
    try {
     //console.log("data gửi mail contact nè ",mailData);
      const response = await axiosInstance.post(
        API_ENDPOINTS.SEND_MAIL,
        mailData
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  create: async (body) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_CONTACT,
        body
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (contactId, body) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.UPDATE_CONTACT}${contactId}`,
        body
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  delete: async (contactId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_CONTACT}?id=${contactId}`
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default contactRequests;
