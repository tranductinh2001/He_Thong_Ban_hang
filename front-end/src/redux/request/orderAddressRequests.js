import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const orderAddressRequests = {
  createOrderAddress: async (order_address) => {
    try {
      // console.log("request ", order_address);
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_ORDER_ADDRESS,
        order_address
      );
      // console.log("data ", response);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  SetDefaultOrderAddress: async (order_address_id) => {
    try {
      // console.log("order_address_id ", order_address_id);

      const response = await axiosInstance.put(
        API_ENDPOINTS.SET_DEFAULT_ORDER_ADDRESS(order_address_id)
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error set default order address:", error);
      throw error;
    }
  },
  fetchOrderAddress: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GET_ORDER_ADDRESS}/${userId}`
      );
      // console.log("fetchOrderAddress ", response);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default orderAddressRequests;
