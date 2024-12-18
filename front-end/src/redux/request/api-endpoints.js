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
  GET_PRODUCT: `/product`,
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
  UPDATE_USER: `/user/update`,
  DELETE_USER: `/user/delete`,
  USER_DETAIL: "/user/profile",

  //review
  GET_REVIEW: `/reviews`,
  CREATE_REVIEW: `/reviews/create`,
  UPDATE_REVIEW: `/reviews/update/`,
  DELETE_REVIEW: `/reviews/delete`,

  //contacts
  GET_CONTACT: `/contact`,
  CREATE_CONTACT: `/contact/create`,
  UPDATE_CONTACT: `/contact/update/`,
  DELETE_CONTACT: `/contact/delete`,
  SEND_MAIL: '/contact/send-mail',

  //authentication
  LOGIN: `auth/login`,
  CHANGE_PASSWORD: `/user/change-password`,
  RIGISTER: `/auth/register`,

  //order address
  CREATE_ORDER_ADDRESS: `/orderAddress/create/order-address`,
  GET_ORDER_ADDRESS: `/orderAddress/order-address/user`,
  SET_DEFAULT_ORDER_ADDRESS: (order_address_id) =>
    `/orderAddress/set-default/${order_address_id}`,

  // cart
  GET_CART_BY_ID_USER: `/cart/my-cart`,
  UPDATE_CART: `/cart/update`,
  REMOVE_FROM_CART: `/cart/update`,

  //order
  GET_ORDERS: `/order`,
  GET_ORDER_BY_USER_ID: `/order/user`,
  ADD_ORDER: `/order`,
  UPDATE_ORDER_STATUS: (order_id) => `/order/update/${order_id}`,

  //thống kê tháng năm trong (Order)
  GET_STATISTIC_PRICE_BY_DATE_RANGE: '/order/total-price-by-date',
  GET_STATISTIC_PRICE_BY_YEAR: '/order/total-price-by-year',
  GET_STATISTIC_PRICE_BY_MONTH:'/order/total-price-by-month',

  //thống kê tổng
  GET_STATISTIC_ALL: '/statistics/all',

  //payment
  CREATE_CHECKOUT_SESSION: `/payment/create-checkout-session`,
  CHECKOUT_SESSION: (session_id) =>
    `/payment/checkout-session?sessionId=${session_id}`,

  //room
  CREATE_MODEL_IN_ROOM: `/room/create-model`,

  //model-try-on-history
  GET_MODEL_TRY_ON_HISTORY_BY_USER_ID: `/model-try-on-history/user`,
  DELETE_MODEL_TRY_ON_HISTORY: `/model-try-on-history/delete`,
};

export default API_ENDPOINTS;
