import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
// import { request } from "../request";
import authRequests from "../request/authRequests";

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("payload   ", payload);
      const response = await authRequests.loginService(payload);
      const { jwt, user } = response.data;
      localStorage.setItem("jwt", jwt?.value);
      // localStorage.setItem("refresh_token", jwt?.refresh_token);
      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("creating dispatch", data);
      const response = await authRequests.Register(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("create async thunk", data);
      const response = await authRequests.changePassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.reponse.data);
    }
  }
);
export const fetchUserDetail = createAsyncThunk(
  "auth/fetchUserDetail",
  async (_, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        const decodedToken = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          throw new Error("Token expired");
        }
        const response = await authRequests.UserDetail();
        return response.data;
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue({ message: "Token expired or invalid" });
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const initialState = {
  currentUser: null,
  isAuthenticated: false,
  jwt: null,
  errorMessages: "",
  errorRegisterMessages: [],
  isLoading: false,
  success: false,
  createdAccountSuccess: false,
  registerForm: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.jwt = null;
      state.errorMessages = null;
      localStorage.removeItem("jwt");
      state.success = false;
      state.createdAccountSuccess = false;
    },
    setCreatedAccount: (state) => {
      state.createdAccountSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.errorMessages = "";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(" auth ",action.payload)
      state.isLoading = false;
      state.currentUser = action.payload;
      state.jwt = action.payload.jwt?.value;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      console.log(" auth rejected ",action.payload)
      state.isLoading = false;
      state.errorMessages = action.payload?.message;
    });
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
      state.success = false;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.currentUser = action.payload;
      state.errorMessages = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessages = action.error.message;
      state.success = false;
    });
    builder.addCase(fetchUserDetail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUserDetail.rejected, (state, action) => {
      console.log("vào     builder.addCase(fetchUserDetail.rejected, (state, action) ");
      state.isLoading = false;
      state.jwt = null;
      state.isAuthenticated = false;
      //localStorage.removeItem("jwt");
    });
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.errorRegisterMessages = null;
      state.createdAccountSuccess = false;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.registerForm = action.payload;
      state.errorRegisterMessages = null;
      state.createdAccountSuccess = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.errorRegisterMessages = action.payload;
      console.log(action.payload);
      state.registerForm = null;
      state.createdAccountSuccess = false;
    });
  },
});

export const { logout, setCreatedAccount } = authSlice.actions;

export default authSlice.reducer;
