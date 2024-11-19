import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../request";


export const fetchFiveProduct = createAsyncThunk(
  "products/fetchFiveProduct",
  async({keyWord, currentPage},{rejectWithValue}) =>{
    try {
      console.log("keyword 2", keyWord, currentPage)
      return await request.searchProduct(keyWord , currentPage);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "Search",
  initialState: {
    productListSearch:[],
    productListSearchCombie:[],
    loading: false,
    error: null,
    pageSize: 6,
    totalProductItems: null,
  },
  reducers: {
    setActiveResetProductList(state, action) {
      state.productListSearch = []
      state.totalProductItems = null
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchFiveProduct.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiveProduct.fulfilled, (state, action)=> {
        state.loading = false;
        state.productListSearch = [...state.productListSearch, ...action.payload.products];
        console.log(action.payload)

        state.totalProductItems = action.payload?.totalItems;
        state.pageSize = action.payload?.totalPages;
      })
      .addCase(fetchFiveProduct.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;

// Export các actions nếu cần (optional)
export const { setActiveResetProductList } = searchSlice.actions;
