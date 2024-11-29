import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import cartReducer from "../redux/slices/cartSlice";
import orderAddressSlice from "../redux/slices/orderAddressSlice";
import productSlice from "../redux/slices/productSlice";
import categorySlice from "../redux/slices/categorySlice";
import brandSlice from "../redux/slices/brandSlice";
import colorSlice from "../redux/slices/colorSlice";
import sizeSlice from "../redux/slices/sizeSlice";
import serviceSlice from "../redux/slices/serviceSlice";
import searchSlice from "../redux/slices/searchSlice";
import userSlice from "../redux/slices/userSlice";
import orderSlice from "../redux/slices/orderSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productSlice,
    category: categorySlice,
    brand: brandSlice,
    color: colorSlice,
    size: sizeSlice,
    service: serviceSlice,
    cart: cartReducer,
    Search: searchSlice,
    user: userSlice,
    orderAddress: orderAddressSlice,
    order: orderSlice,
  },
});
