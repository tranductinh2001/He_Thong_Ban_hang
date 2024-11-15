import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";


const orderRequests = {
  GetOrders: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_ORDERS);
      console.log("data ", response);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  },
  createOrderAddress: async (order_address) => {
    try {
      console.log("request ", order_address);
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_ORDER_ADDRESS,
        { order_address: order_address }
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  SetDefaultOrderAddress: async (order_address_id) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.SET_DEFAULT_ORDER_ADDRESS(order_address_id)
      );
      console.log(order_address_id);
      return response.data;
    } catch (error) {
      console.error("Error set default order address:", error);
      throw error;
    }
  },
  CreateOrder: async (order) => {
    try {
      console.log("request", order);
      const response = await axiosInstance.post(API_ENDPOINTS.ADD_ORDER, order);
      console.log("response", response);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  },
  UpdateOrderStatus: async (order_id, order_status) => {
    try {
      console.log("request order_id and order_status", order_id, order_status);
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_ORDER_STATUS(order_id),
        { order_status }
      );
      return response.data;
    } catch (error) {
      console.error("Error when delete:", error);
      throw error;
    }
  },
  CreateCheckoutSession: async (order) => {
    try {
      console.log("request js", order);
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_CHECKOUT_SESSION,
        order
      );
      return response.data;
    } catch (error) {
      console.error("Error when create checkout session:", error);
      throw error;
    }
  },
  CheckoutSession: async (session_id) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.CHECKOUT_SESSION(session_id)
      );
      console.log("request checkout session", response.data);
      return response.data;
    } catch (error) {
      console.error("Error when checkout session:", error);
      throw error;
    }
  }
};

export default orderRequests;
