import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userRequests from "../request/userRequests.js";

export const fetchUserList = createAsyncThunk(
    "user/fetchUserList",
    async (_, { rejectWithValue }) => {
      try {
        const response = await userRequests.getAll();
        return response;
      } catch (error) {
        return rejectWithValue(
          error.response ? error.response.data : error.message
        );
      }
    }
  );

export const fetchUserDetail = createAsyncThunk(
  "user/fetchUserDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequests.UserDetail();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  "user/fetchUpdateUser",
  async ({ data, id}, { rejectWithValue }) => {
    try {
      console.log("fetchUpdateUser",data, id)
      const response = await userRequests.UpdateUserProdfile(data , id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpdateRelationUser = createAsyncThunk(
  "user/fetchUpdateRelationUser",
  async ({ userId, orderAddressId }, { rejectWithValue }) => {
    try {
      // console.log("fetchupdateRelationUser ", userId, orderAddressId);
      const response = await userRequests.updateRelationUser({
        userId: userId,
        oderAddressId: orderAddressId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userList: [],
    user: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setNullStatussuccess(state) {
      state.success = null;
    },
    setNullStatusloading(state) {
      state.loading = false;
    },
    setNullStatuserror(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default userSlice.reducer;
export const {
  setNullStatussuccess, setNullStatuserror, setNullStatusloading
} = userSlice.actions;
