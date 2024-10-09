const API_ENDPOINTS = {
  //product endpoint
  GET_LIST_PRODUCTS: (currentPage, pageSize) =>
    `/product/pagination?currentPage=${currentPage}&pageSize=${pageSize}`,
  SEARCH_PRODUCTS: (keyWord, currentPage) =>
    `/product/search?q=${keyWord}&pageSize=4&page=${currentPage}`,
  SEARCH_LIST_PRODUCTS: (keyWord, currentPage, pageSize) =>
    `/product/search?q=${keyWord}&pageSize=${pageSize}&page=${currentPage}`,
  LIST_SORT: (sort, currentPage, pageSize) =>
    `product/sort?page=${currentPage}&pageSize=${pageSize}&orderBy=${sort}`,
  LIST_FILLTER: (title, sort, currentPage, pageSize) =>
    `/product/filter?page=${currentPage}&pageSize=${pageSize}&${title}=${sort}`,
  LIST_SALE: (currentPage, pageSize)  => `/product/sale?page=${currentPage}&pageSize=${pageSize}`,
  PRODUCT_DETAIL: (productId) => `/product/${productId}`,

  //user
  USER_DETAIL: `/user/profile`,
  UPDATE_USER: `/user/update`,

  //authentication
  LOGIN: `auth/login`,
  CHANGE_PASSWORD: `/auth/change-password`,
  RIGISTER: `/auth/register`,

  //order address
  CREATE_ORDER_ADDRESS: `/order-address`,
  GET_ORDER_ADDRESS: `/order-address`,
  SET_DEFAULT_ORDER_ADDRESS: (order_address_id) =>
    `/order-address/set-default/${order_address_id}`,

  // cart
  GET_CART_BY_ID_USER: () => `/cart`,
  ADD_TO_CART: () => `/cart/update`,
  UPDATE_CART: () => `/cart/update`,
  REMOVE_FROM_CART: () => `/cart/update`,

  //order
  GET_ORDERS: `/order`,
  ADD_ORDER: `/order`,
  UPDATE_ORDER_STATUS: (order_id) => `/order/update-order-status/${order_id}`,

  //payment
  CREATE_CHECKOUT_SESSION: `/payment/create-checkout-session`,
  CHECKOUT_SESSION: (session_id) =>
    `/payment/checkout-session?sessionId=${session_id}`,
};

export default API_ENDPOINTS;
