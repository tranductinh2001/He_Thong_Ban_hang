import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import brandRequests from "../request/brandRequests.js";

export const fetchBrandList = createAsyncThunk(
  "brands/fetchBrandList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await brandRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const brandSlice = createSlice({
  name: "brand",
  initialState: {
    brandList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandList.fulfilled, (state, action) => {
        state.loading = false;
        state.brandList = action.payload;
      })
      .addCase(fetchBrandList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default brandSlice.reducer;
