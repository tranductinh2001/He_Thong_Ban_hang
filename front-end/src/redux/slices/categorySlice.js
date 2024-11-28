import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryRequests from "../request/categoryRequests.js";

export const fetchCategoryList = createAsyncThunk(
  "categories/fetchCategoryList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
      })
      .addCase(fetchCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default categorySlice.reducer;
