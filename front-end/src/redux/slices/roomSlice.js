import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roomRequests from "../request/roomRequests";

export const createModelInRoom = createAsyncThunk(
  "room/createModelInRoom",
  async({data},{rejectWithValue}) =>{
    try {
            // In tất cả dữ liệu trong FormData
            // data.forEach((value, key) => {
            //  //console.log(`Key: ${key}, Value:`, value);
            // });
      // console.log("data trong room slice === ", data);  // Kiểm tra data nhận được
      return await roomRequests.createModelInRoom(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState: {
    listImageModel:[],
    loading: false,
    error: null,
  },
  reducers: {
    setActiveResetImageModel(state, action) {
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(createModelInRoom.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createModelInRoom.fulfilled, (state, action)=> {
        state.loading = false;
        state.listImageModel = [...state.listImageModel, ...action.payload.listImageModel];
       //console.log(action.payload)

        state.totalProductItems = action.payload?.totalItems;
        state.pageSize = action.payload?.totalPages;
      })
      .addCase(createModelInRoom.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roomSlice.reducer;

// Export các actions nếu cần (optional)
export const { setActiveResetProductList } = roomSlice.actions;
