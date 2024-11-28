import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sizeRequests from "../request/sizeRequests.js";

export const fetchSizeList = createAsyncThunk(
  "sizes/fetchSizeList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sizeRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const sizeSlice = createSlice({
  name: "Size",
  initialState: {
    sizeList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSizeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSizeList.fulfilled, (state, action) => {
        state.loading = false;
        state.sizeList = action.payload;
      })
      .addCase(fetchSizeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default sizeSlice.reducer;
