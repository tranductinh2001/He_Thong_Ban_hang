export { default as request } from "./request";
import productRequest from "./productRequests.js";
import categoryRequest from "./categoryRequests.js";
import brandRequest from "./brandRequests.js";
import colorRequest from "./colorRequests.js";
import sizeRequest from "./sizeRequests.js";
import imageRequest from "./imageRequests.js";
import userRequest from "./userRequests.js";
import orderRequest from "./orderRequests.js";
import cartRequest from "./cartRequests.js";
import authRequests from "./authRequests.js";

export default {
  productRequest,
  categoryRequest,
  brandRequest,
  colorRequest,
  sizeRequest,
  imageRequest,
  userRequest,
  orderRequest,
  cartRequest,
  authRequests,
};
