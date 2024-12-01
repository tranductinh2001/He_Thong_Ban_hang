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
  LIST_SALE: (currentPage, pageSize) =>
    `/product/sale?page=${currentPage}&pageSize=${pageSize}`,
  PRODUCT_DETAIL: (productId) => `/product/${productId}`,
  CREATE_PRODUCT: `/product/create`,
  UPDATE_PRODUCT: `/product/update/`,
  DELETE_PRODUCT: `/product/delete`,

  //image
  UPLOAD_IMAGE: `/image/upload-file`,

  //service
  GET_SERVICE: `/service`,
  CREATE_SERVICE: `/service/create`,
  UPDATE_SERVICE: `/service/update/`,
  DELETE_SERVICE: `/service/delete`,

  //brand
  GET_BRAND: `/brand`,
  CREATE_BRAND: `/brand/create`,
  UPDATE_BRAND: `/brand/update/`,
  DELETE_BRAND: `/brand/delete`,

  //category
  GET_CATEGORY: `/category`,
  CREATE_CATEGORY: `/category/create`,
  UPDATE_CATEGORY: `/category/update/`,
  DELETE_CATEGORY: `/category/delete`,

  //color
  GET_COLOR: `/color`,
  CREATE_COLOR: `/color/create`,
  UPDATE_COLOR: `/color/update/`,
  DELETE_COLOR: `/color/delete`,

  //size
  GET_SIZE: `/size`,

  //user
  GET_USER: `/user`,
  UPDATE_USER_PROFILE: (id) => `/user/updateProfile/${id}`,
  UPDATE_USER: (id) => `/user/update/${id}`,
  DELETE_USER: `/user/delete`,
  USER_DETAIL: "/user/profile",

  //authentication
  LOGIN: `auth/login`,
  CHANGE_PASSWORD: `/user/change-password`,
  RIGISTER: `/auth/register`,

  //order address
  CREATE_ORDER_ADDRESS: `/order-address`,
  GET_ORDER_ADDRESS: `/order-address`,
  SET_DEFAULT_ORDER_ADDRESS: (order_address_id) =>
    `/order-address/set-default/${order_address_id}`,

  // cart
  GET_CART_BY_ID_USER: `/cart/my-cart`,
  UPDATE_CART: `/cart/update`,
  REMOVE_FROM_CART: `/cart/update`,

  //order
  GET_ORDERS: `/order/oderAll`,
  ADD_ORDER: `/order`,
  UPDATE_ORDER_STATUS: (order_id) => `/order/update-order-status/${order_id}`,

  //payment
  CREATE_CHECKOUT_SESSION: `/payment/create-checkout-session`,
  CHECKOUT_SESSION: (session_id) =>
    `/payment/checkout-session?sessionId=${session_id}`,

  //room
  CREATE_MODEL_IN_ROOM: `/room/create-model`,
};

export default API_ENDPOINTS;
