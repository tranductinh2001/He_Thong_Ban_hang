import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";

const cartRequests = {
  GetCartByUser: async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER
      );
      console.log("dữ liệu từ fe trả về khi gọi all cart từ user   ", response);
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  },
  AddToCart: async (cartItem) => {
    try {
      const userCart = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER
      );

      let existingProduct = userCart?.data?.items.find((item) => {
        return (
          item.product?._id === cartItem?.product?._id &&
          item?._id === cartItem?._id &&
          item.product?.size_list?.some(
            (sizeItem) => sizeItem.size_name === cartItem?.size
          )
        );
      });

      let updatedProducts;
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count + 1,
        };
        updatedProducts = userCart.data.items.map((item) =>
          item.product._id === existingProduct.product._id &&
          item._id === existingProduct._id
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.items, cartItem];
      }

      let updatedTotal = cartItem?.product?.is_sale
        ? userCart?.data?.total_of_price + cartItem?.product?.sale_price
        : userCart?.data?.total_of_price + cartItem?.product?.price;

      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);

      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART,
        {
          items: updatedProducts,
          total_of_price: updatedTotal,
          total_of_product: numberOfProduct,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },
  RemoveFromCart: async (cartItem) => {
    try {
      const userCart = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER
      );

      let existingProduct = userCart?.data?.items.find((item) => {
        return (
          item.product?._id === cartItem?.product?._id &&
          item?._id === cartItem?._id &&
          item.product?.size_list?.some(
            (sizeItem) => sizeItem.size_name === cartItem?.size
          )
        );
      });

      let updatedProducts;
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count - 1,
        };
        updatedProducts = userCart.data.items.map((item) =>
          item.product._id === existingProduct.product._id &&
          item._id === existingProduct._id
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.items, cartItem];
      }

      let updatedTotal = cartItem?.product?.is_sale
        ? userCart?.data?.total_of_price - cartItem?.product?.sale_price
        : userCart?.data?.total_of_price - cartItem?.product?.price;

      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);

      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART,
        {
          items: updatedProducts,
          total_of_price: updatedTotal,
          total_of_product: numberOfProduct,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to remove cart:", error);
      throw error;
    }
  },
  AddManyToCart: async (products) => {
    // console.log("adđ product   ", products);
    try {
      const productsTotal = products.reduce((total, item) => {
        const price = item.product.sale
          ? item.product?.salePrice
          : item.product?.price;
        const count = item.count;
        return total + price * count;
      }, 0);
// console.log("product total  ", productsTotal);
      const userCartResponse = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER
      );
// console.log("cart từ user hiện tại ", userCartResponse);
      let userCart = userCartResponse?.data || { items: [], total: 0 , totalOfPrice: 0};
      const updatedCartProducts = [...userCart.items];

// console.log("user cart sau khi phân tích từ sponse ", userCart);

      products.forEach((productItem) => {
        const existingItemIndex = updatedCartProducts.findIndex(
          (cartItem) => cartItem.size === productItem.size
        );
        // console.log("exissting  ", existingItemIndex);
        if (existingItemIndex !== -1) {
          updatedCartProducts[existingItemIndex].count += productItem.count;
          // console.log("1");
        } else {
          updatedCartProducts.push(productItem);
          // console.log("2");
          
        }
      });
      const updatedCartTotal = userCart.totalOfPrice + productsTotal;
      const numberOfProduct = updatedCartProducts.reduce(
        (accumulator, product) => {
          return accumulator + product.count;
        },
        0
      );
      // const a = {
      //   items: updatedCartProducts,
      //   totalOfProduct: numberOfProduct,
      //   totalOfPrice: updatedCartTotal,
      // }
// console.log("data batch cart all:   ",a);
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART,
        {
          items: updatedCartProducts,
          totalOfProduct: numberOfProduct,
          totalOfPrice: updatedCartTotal,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add many to cart:", error);
      throw error;
    }
  },
  DeleteFromCart: async (userId, cartItem) => {
    try {
      const userCart = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER(userId)
      );

      let existingProduct = userCart?.data?.items.find((item) => {
        return (
          item.product?._id === cartItem?.product?._id &&
          item?._id === cartItem?._id &&
          item.product?.size_list?.some(
            (sizeItem) => sizeItem.size_name === cartItem?.size
          )
        );
      });

      let updatedProducts;
      if (existingProduct) {
        updatedProducts = userCart.data.items.filter(
          (cartItem) =>
            !(
              cartItem.product._id === existingProduct.product._id &&
              cartItem._id === existingProduct._id
            )
        );
      }

      const productPrice = existingProduct?.product?.is_sale
        ? existingProduct?.product?.sale_price * existingProduct?.count
        : existingProduct?.product?.price * existingProduct?.count;

      const updatedTotal = userCart.data.total_of_price - productPrice;

      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);

      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART(userId),
        {
          items: updatedProducts,
          total_of_price: updatedTotal,
          total_of_product: numberOfProduct,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete from cart:", error);
      throw error;
    }
  }
};

export default cartRequests;
