import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contactRequests from "../request/contactRequests.js";

export const fetchContactList = createAsyncThunk(
  "contacts/fetchContactList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await contactRequests.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetctSendMailContact = createAsyncThunk(
  "contacts/sendMailContact",
  async (mailData, { rejectWithValue }) => {
    try {
      const response = await contactRequests.sendMail(mailData); 
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contactList: [],
    loading: false,
    error: null,
    sendMailStatus: null, 
    sendMailError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactList.fulfilled, (state, action) => {
        state.loading = false;
        state.contactList = action.payload;
      })
      .addCase(fetchContactList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetctSendMailContact.pending, (state) => {
        state.sendMailStatus = "pending";
        state.sendMailError = null;
      })
      .addCase(fetctSendMailContact.fulfilled, (state) => {
        state.sendMailStatus = "fulfilled";
      })
      .addCase(fetctSendMailContact.rejected, (state, action) => {
        state.sendMailStatus = "rejected";
        state.sendMailError = action.payload || "Failed to send mail";
      });
  },
});

export default contactSlice.reducer;
