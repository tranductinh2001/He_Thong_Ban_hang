import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewRequests from "../request/reviewRequests.js";

// Fetch tất cả bình luận
export const fetchReviewList = createAsyncThunk(
  "reviews/fetchReviewList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewRequests.getAll(); // Gọi API để lấy toàn bộ bình luận
      return response.data; // Trả về dữ liệu (data) trong response
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message // Xử lý lỗi
      );
    }
  }
);

// Fetch bình luận theo productId
export const fetchReviewListByProductId = createAsyncThunk(
  "reviews/fetchReviewListByProductId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewRequests.getAllByProductId(productId); // Gọi API với productId
      return response; // Trả về dữ liệu (data) trong response
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
    reviewList: [], // Dữ liệu của các bình luận
    loading: false, // Trạng thái loading
    error: null, // Thông báo lỗi
  },
  reducers: {
    clearReviewList: (state) => {
     //console.log("Resetting review list to empty"); // In ra thông báo khi dữ liệu bị reset
      state.reviewList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cập nhật trạng thái khi fetching dữ liệu toàn bộ review
      .addCase(fetchReviewList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewList.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewList = action.payload || []; // Cập nhật reviewList khi thành công
      })
      .addCase(fetchReviewList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Cập nhật lỗi khi thất bại
      })
      // Cập nhật trạng thái khi fetching bình luận theo productId
      .addCase(fetchReviewListByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewListByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewList = action.payload || [];  // Đảm bảo action.payload là dữ liệu cần thiết
      })
      .addCase(fetchReviewListByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Cập nhật lỗi khi thất bại
      });
  },
});

export const { clearReviewList } = reviewSlice.actions;

export default reviewSlice.reducer;
