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

export const fetchSizesByProductId = createAsyncThunk(
  "sizes/fetchSizesByProductId",
  async (id, { rejectWithValue }) => {
    try {
      console.log("fetchSizesByProductId   id   ", id);
      const response = await sizeRequests.getSizesByProductId(id);
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
    sizeListByIdProduct: [],
    loadingSizeList: false, 
    loadingSizeByProductId: false, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Trạng thái cho `fetchSizeList`
      .addCase(fetchSizeList.pending, (state) => {
        state.loadingSizeList = true;
        state.error = null;
      })
      .addCase(fetchSizeList.fulfilled, (state, action) => {
        state.loadingSizeList = false;
        state.sizeList = action.payload;
      })
      .addCase(fetchSizeList.rejected, (state, action) => {
        state.loadingSizeList = false;
        state.error = action.payload || "Something went wrong";
      })

      // Trạng thái cho `fetchSizesByProductId`
      .addCase(fetchSizesByProductId.pending, (state) => {
        state.loadingSizeByProductId = true;
        state.error = null;
      })
      .addCase(fetchSizesByProductId.fulfilled, (state, action) => {
        state.loadingSizeByProductId = false;
        state.sizeListByIdProduct = action.payload;
        console.log("slice size  ", state.sizeListByIdProduct );
      })
      .addCase(fetchSizesByProductId.rejected, (state, action) => {
        state.loadingSizeByProductId = false;
        state.error = action.payload || "Lỗi server";
      });
  },
});

export default sizeSlice.reducer;
