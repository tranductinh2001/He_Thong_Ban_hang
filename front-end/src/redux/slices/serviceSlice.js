import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import serviceRequests from "../request/serviceRequests.js";

export const fetchServiceList = createAsyncThunk(
  "services/fetchServiceList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    serviceList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceList = action.payload;
      })
      .addCase(fetchServiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default serviceSlice.reducer;
