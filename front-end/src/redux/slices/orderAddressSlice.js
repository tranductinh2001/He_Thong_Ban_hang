import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderAddressRequests from "../request/orderAddressRequests";

export const fetchCreateOrderAddress = createAsyncThunk(
  "orderAddress/fetchCreateOrderAddress",
  async (order_address, { rejectWithValue }) => {
    try {
      const response = await orderAddressRequests.createOrderAddress(
        order_address
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultOrderAddress = createAsyncThunk(
  "orderAddress/setDefaultOrderAddress",
  async (order_address_id, { rejectWithValue }) => {
    try {
      const response = await orderAddressRequests.SetDefaultOrderAddress(
        order_address_id
      );
      // console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderAddress = createAsyncThunk(
  "orderAddress/fetchOrderAddress",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderAddressRequests.fetchOrderAddress(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const OrderAddressSlice = createSlice({
  name: "orderAddress",
  initialState: {
    order_addresses: [],
    orderAddress: [],
    defaultOrderAddress: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateOrderAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateOrderAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.orderAddress = action.payload;
        if (!Array.isArray(state.order_addresses)) {
          state.order_addresses = [];
        }
        state.order_addresses = [...state.order_addresses, state.orderAddress];
      })
      .addCase(fetchCreateOrderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.order_addresses = action.payload;
        state.defaultOrderAddress = action.payload?.find(
          (item) => item.isDefault === true
        );
      })
      .addCase(fetchOrderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setDefaultOrderAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultOrderAddress.fulfilled, (state, action) => {
        // console.log(action.payload);

        state.loading = false;
        state.isDefault = action.payload;
        state.defaultOrderAddress = action.payload?.find(
          (item) => item.isDefault === true
        );
        console.log(state.defaultOrderAddress);
        state.orderAddress = action.payload;
        if (!Array.isArray(state.order_addresses)) {
          state.order_addresses = [];
        }
        state.order_addresses = [];
        
        state.order_addresses = [...state.order_addresses, ...state.orderAddress];
        // console.log(state.order_addresses);
      })
      .addCase(setDefaultOrderAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default OrderAddressSlice.reducer;

// Export các actions nếu cần (optional)
export const {} = OrderAddressSlice.actions;
