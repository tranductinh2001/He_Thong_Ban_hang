import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./handleRequests/errorHandler";

const productRequests = {
  List: async (currentPage, pageSize) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_LIST_PRODUCTS(currentPage, pageSize)
      );
      console.log("kkk", response)
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  searchProduct: async (keyWord, currentPage) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SEARCH_PRODUCTS(keyWord, currentPage)
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  listProductSearch: async ({ keyWord, currentPage, pageSize }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SEARCH_LIST_PRODUCTS(keyWord, currentPage, pageSize)
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  ListSort: async ({ sort, title, currentPage, pageSize }) => {
    try {
      let url = "";
      if (
        sort != "true" &&
        sort != "false" &&
        title != "brand" &&
        title != "category"
      ) {
        url += API_ENDPOINTS.LIST_SORT(sort, currentPage, pageSize);
      } else {
        title = title === "Hot" ? "hot" : title;
        url += API_ENDPOINTS.LIST_FILLTER(title, sort, currentPage, pageSize);
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  ListSaleProduct: async (currentPage, pageSize) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.LIST_SALE(currentPage, pageSize)
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  ProductDetail: async (productId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.PRODUCT_DETAIL(productId)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product detail data:", error);
      throw error;
    }
  }
};

export default productRequests;
