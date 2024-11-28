import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import colorRequests from "../request/colorRequests.js";

export const fetchColorList = createAsyncThunk(
  "colors/fetchColorList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await colorRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const colorSlice = createSlice({
  name: "color",
  initialState: {
    colorList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColorList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColorList.fulfilled, (state, action) => {
        state.loading = false;
        state.colorList = action.payload;
      })
      .addCase(fetchColorList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default colorSlice.reducer;
