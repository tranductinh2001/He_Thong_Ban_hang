import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewRequests from "../request/reviewRequests.js";

export const fetchReviewList = createAsyncThunk(
  "reviews/fetchReviewList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviewList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewList.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewList = action.payload;
      })
      .addCase(fetchReviewList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default reviewSlice.reducer;
