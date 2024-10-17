export { default as request } from "./request";
import productRequest from "./productRequests.js";
import userRequest from "./userRequests.js";
import orderRequest from "./orderRequests.js";
import cartRequest from "./cartRequests.js";
import authRequests from "./authRequests.js";

export default {
  productRequest,
  userRequest,
  orderRequest,
  cartRequest,
  authRequests,
};
