import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const authRequests = {
  loginService: async (payload) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        username: payload.email,
        password: payload.password,
      });
      console.log(response);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  },
  changePassword: async (data) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CHANGE_PASSWORD, data);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  },
  Register: async (data) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.RIGISTER, {
        email: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        numberPhone: data.number_phone,
        address: data.address,
        dob: data.dob,
      });
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

export default authRequests;
