import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { request } from "../productRequests";
// import { productRequests } from "../request/productRequests"
import productRequests  from "../request/productRequests.js"

export const fetchProductListWithSortOrTitle = createAsyncThunk(
  "products/fetchProductListWithSortOrTitle",
  async (
    { sortParam, titleParam, currentPage, pageSize },
    { rejectWithValue }
  ) => {
    try {
      // console.log(" ------ ", sortParam, titleParam);
      return await productRequests.ListSort({
        sort: sortParam,
        title: titleParam,
        currentPage,
        pageSize,
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductListWithSearch = createAsyncThunk(
  "products/fetchProductListWithSearch",
  async ({ searchParam, currentPage, pageSize }, { rejectWithValue }) => {
    try {
      return await productRequests.listProductSearch({
        keyWord: searchParam,
        currentPage,
        pageSize,
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductList = createAsyncThunk(
  "products/fetchProductList",
  async ({ currentPage, pageSize }, { rejectWithValue }) => {
    try {
      //console.log("trang:  ", currentPage, pageSize);
      return await productRequests.List(currentPage, pageSize);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// lấy thông tin chi tiết sản phẩm
export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productRequests.ProductDetail(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//lấy các sản phẩm giảm giá
export const fetchSaleProductList = createAsyncThunk(
  "products/fetchSaleProductList",
  async ({ currentPage, pageSize }, { rejectWithValue }) => {
    try {
      const response = await productRequests.ListSaleProduct(currentPage, pageSize);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    productCategoryList: [],
    productBrandList: [],
    newProductList: [],
    saleProductList: [],
    hotProductList: [],
    highPriceProductList: [],
    expensiveProductList: [],
    productListWithSearchbyPage: [],
    combinedProductList: [],
    productDetails: null,
    loading: false,
    error: null,
    pageSize: 3,
    totalProductItems: null,
    currentPage: null,
    totalPage: null,
    activeFilter: {
      title: null,
      sort: null,
    },
  },
  reducers: {
    setActiveFilter(state, action) {
      const { title, sort } = action.payload;
      state.activeFilter = { title: title, sort: sort };
      state.productList = [];
      state.newProductList = [];
      state.saleProductList = [];
      state.hotProductList = [];
      state.highPriceProductList = [];
      state.expensiveProductList = [];
      state.productListWithSortOrTitleByPage = [];
      state.combinedProductList = [];
      state.productListWithSearchbyPage = [];
      state.productBrandList = [];
      state.productCategoryList = [];
      state.totalProductItems = 0;
      // console.log("active 1", state.activeFilter, state.combinedProductList);
    },
    setActiveProductDetail(state, action) {
      const { title, sort } = action.payload;
      state.saleProductList = [];
      state.activeFilter = { title: title, sort: sort };
      // console.log(
      //   "active setActiveProductDetail",
      //   state.activeFilter,
      //   state.combinedProductList
      // );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductListWithSortOrTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductListWithSortOrTitle.fulfilled, (state, action) => {
        state.loading = false;
      
        const title = state.activeFilter.title;
        switch (title) {
          case "New":
            state.newProductList = [
              ...state.newProductList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.newProductList];
            break;
          case "Sale":
            state.saleProductList = [
              ...state.saleProductList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.saleProductList];
            break;
          case "Hot":
            state.hotProductList = [
              ...state.hotProductList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.hotProductList];
            break;
          case "Giá Thấp":
            state.highPriceProductList = [
              ...state.highPriceProductList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.highPriceProductList];
            break;
          case "Giá cao":
            state.expensiveProductList = [
              ...state.expensiveProductList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.expensiveProductList];
            break;
          case "brand":
            state.productBrandList = [
              ...state.productBrandList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.productBrandList];
            break;
          case "category":
            state.productCategoryList = [
              ...state.productCategoryList,
              ...action.payload.products,
            ];
            state.combinedProductList = [...state.productCategoryList];
            break;
          default:
            state.productList = [...state.productList, ...action.payload.products];
            state.combinedProductList = [...state.productList];
        }
      
        // Cập nhật các thông tin về tổng số item và số trang
        state.totalProductItems = action.payload?.totalItems;
        state.pageSize = action.payload?.totalPages;
      })
       
      .addCase(fetchProductListWithSortOrTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductListWithSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductListWithSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.productListWithSearchbyPage = [
          ...state.productListWithSearchbyPage,
          ...action.payload.products,
        ];
        // console.log("state.productListWithSearchbyPage ", action.payload.data);
        state.combinedProductList = [...state.productListWithSearchbyPage];
        // console.log("state.combinedProductList , ", state.combinedProductList);
        state.totalProductItems = action.payload.meta?.pagination?.total;
        state.pageSize = action.payload.meta.pagination.pageSize;
      })
      .addCase(fetchProductListWithSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        // console.log("Reset state check:", state.combinedProductList);
        //console.log("acitoon.payload   ", action.payload.products)
        state.loading = false;
        state.productList = [...state.productList, ...action.payload.products];
        // console.log("state.productListByPage , ", state.productListByPage);
        state.combinedProductList = [...state.productList];
        //console.log("state.combinedProductList , ", state.combinedProductList);
        state.totalProductItems = action.payload?.totalItems;
        state.pageSize = action.payload?.totalPages;
        
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSaleProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleProductList.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(" ",action.payload);
        state.saleProductList = [
          ...state.saleProductList,
          ...action.payload.products,
        ];
        // console.log("fetchSaleProductList:", state.saleProductList);

        // console.log("state.productListByPage , ", state.productListByPage);
        state.totalProductItems = action.payload.totalItems;
        state.pageSize = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
        state.totalPage = action.payload.totalPages;
        // console.log(action.payload)
      })
      .addCase(fetchSaleProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;

// Export các actions nếu cần (optional)
export const {
  setProductList,
  setLoading,
  setError,
  setActiveFilter,
  setActiveProductDetail,
} = productSlice.actions;
