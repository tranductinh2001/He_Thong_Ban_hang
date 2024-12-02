import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import modelTryOnHistoryRequests from "../request/modelTryOnHistoryRequests.js";

export const fetchModelTryOnHistoryList = createAsyncThunk(
  "modelTryOnHistories/fetchModelTryOnHistoryList",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await modelTryOnHistoryRequests.getByUserId(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const modelTryOnHistorySlice = createSlice({
  name: "modelTryOnHistory",
  initialState: {
    modelTryOnHistoryList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelTryOnHistoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelTryOnHistoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.modelTryOnHistoryList = action.payload;
      })
      .addCase(fetchModelTryOnHistoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default modelTryOnHistorySlice.reducer;
