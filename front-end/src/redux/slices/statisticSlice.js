import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderRequests from "../request/orderRequests";
import statisticRequests from "../request/statisticRequests";

const initialState = {
  orders: [],
  orderByUser: [],
  statisticAll: {
    brands: [],
    users: [],
    products: [],
    contacts: [],
  },
  statisticsByYear: [],
  statisticsByDateRange: [],
  statisticsByMonth: [],
  loading: false,
  error: null,
};

export const fetchStatisticAll = createAsyncThunk(
  "statistic/fetchStatisticAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStatisticsByYear = createAsyncThunk(
  "statistic/fetchStatisticsByYear",
  async ({ startYear, endYear }, { rejectWithValue }) => {
    try {
      console.log("vào rồi ", startYear, endYear);
      const response = await orderRequests.getTotalPriceByYear(
        startYear,
        endYear
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStatisticsByDateRange = createAsyncThunk(
  "statistic/fetchStatisticsByDateRange",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      console.log("vào rồi ", startDate, endDate);
      const response = await orderRequests.getTotalPriceByDateRange(
        startDate,
        endDate
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStatisticsByMonth = createAsyncThunk(
  "statistic/fetchStatisticsByMonth",
  async ({ startMonth, endMonth }, { rejectWithValue }) => {
    try {
      console.log("Fetching data for months:", startMonth, endMonth);
      const response = await orderRequests.getTotalPriceByMonth(
        startMonth,
        endMonth
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const statisticSlice = createSlice({
  name: "statistic",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null; // Reset lỗi về null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatisticsByYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticsByYear.fulfilled, (state, action) => {
        state.loading = false;
        state.statisticsByDateRange = [];
        state.statisticsByMonth = []; // Reset statisticsByMonth
        state.statisticsByYear = action.payload;
      })
      .addCase(fetchStatisticsByYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStatisticsByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticsByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.statisticsByYear = [];
        state.statisticsByMonth = []; // Reset statisticsByMonth
        state.statisticsByDateRange = action.payload;
      })
      .addCase(fetchStatisticsByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStatisticsByMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticsByMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.statisticsByYear = [];
        state.statisticsByDateRange = []; // Reset statisticsByDateRange
        state.statisticsByMonth = action.payload;
      })
      .addCase(fetchStatisticsByMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStatisticAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticAll.fulfilled, (state, action) => {
        state.loading = false;
        state.statisticAll = action.payload;
      })
      .addCase(fetchStatisticAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default statisticSlice.reducer;

export const { resetError } = statisticSlice.actions;
