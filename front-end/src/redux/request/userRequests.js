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
  UpdateUser: async (data, id) => {
    try {
      // console.log("datât trong request", data, id);
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_USER(id),
        data
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  UpdateUserProdfile: async (data, id) => {
    try {
      console.log("datât trong request UpdateUserProdfile", data, id, API_ENDPOINTS.UPDATE_USER_PROFILE(id));
      console.log("API Endpoint:", API_ENDPOINTS.UPDATE_USER_PROFILE(id)); // Log URL với id

      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_USER_PROFILE(id),
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
  UserDetail: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER_DETAIL);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },updateRelationUser: async ({ userId, oderAddressId }) => {
    try {
      const data = {
        order_addresses: {
          connect: [oderAddressId],
        },
      };
      const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_USER, data);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
};

export default userRequests;
