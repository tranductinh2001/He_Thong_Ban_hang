import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";

const cartRequests = {
  GetCartByUser: async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER
      );
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  },
  AddToCart: async (cartItem) => {
    try {
      // Lấy giỏ hàng hiện tại của người dùng
      const response = await axiosInstance.get(API_ENDPOINTS.GET_CART_BY_ID_USER);
      const userCart = response?.data;
  
      // Tìm sản phẩm trong giỏ hàng với cùng ID và kích thước
      let existingProduct = userCart?.items.find((item) => 
        item.product?.id === cartItem?.product?.id &&
        item.id === cartItem.id &&
        item.size === cartItem.size
      );
  
      let updatedItems;
      if (existingProduct) {
        // Tăng số lượng nếu sản phẩm đã tồn tại
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count + 1,
        };
        updatedItems = userCart.items.map((item) =>
          item.id === existingProduct.id ? existingProduct : item
        );
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        updatedItems = [...userCart.items, cartItem];
      }
  
      // Cập nhật tổng giá trị giỏ hàng và số lượng sản phẩm
      const updatedTotalOfPrice = cartItem.product.sale
        ? userCart.totalOfPrice + cartItem.product.salePrice
        : userCart.totalOfPrice + cartItem.product.price;
  
      const totalOfProduct = updatedItems.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
  
      // Gửi cập nhật lên server
      const updateResponse = await axiosInstance.put(API_ENDPOINTS.UPDATE_CART, {
        items: updatedItems,
        totalOfPrice: updatedTotalOfPrice,
        totalOfProduct: totalOfProduct,
      });
      return updateResponse.data;
  
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  },
  RemoveFromCart: async (cartItem) => {
    try {
      // Lấy giỏ hàng hiện tại của người dùng
      const response = await axiosInstance.get(API_ENDPOINTS.GET_CART_BY_ID_USER);
      const userCart = response?.data;
  
     //console.log(" response cart do userr", response);

      // Tìm sản phẩm cần xóa trong giỏ hàng
      let existingProduct = userCart?.items.find((item) => 
        item.product?.id === cartItem?.product?.id &&
        item.id === cartItem.id &&
        item.size === cartItem.size
      );
  
      let updatedItems;
      if (existingProduct) {
        // Giảm số lượng sản phẩm hoặc xóa nếu số lượng còn lại là 1
        if (existingProduct.count > 1) {
          existingProduct.count -= 1;
          updatedItems = userCart.items.map((item) =>
            item.id === existingProduct.id ? existingProduct : item
          );
        } else {
          updatedItems = userCart.items.filter(item => item.id !== existingProduct.id);
        }
      } else {
        // Nếu sản phẩm không tồn tại, giữ nguyên giỏ hàng
        updatedItems = [...userCart.items];
      }
  
      // Cập nhật tổng giá trị giỏ hàng và tổng số lượng sản phẩm
      const updatedTotalOfPrice = cartItem.product.sale
        ? userCart.totalOfPrice - cartItem.product.salePrice
        : userCart.totalOfPrice - cartItem.product.price;
  
      const totalOfProduct = updatedItems.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
  
      const a = {
        updatedItems,
        updatedTotalOfPrice,
        totalOfProduct,
      }
     //console.log("cart gửi tới backend   ", a);
      // Gửi cập nhật lên server
      const updateResponse = await axiosInstance.put(API_ENDPOINTS.UPDATE_CART, {
        items: updatedItems,
        totalOfPrice: updatedTotalOfPrice,
        totalOfProduct: totalOfProduct,
      });
      return updateResponse.data;
  
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  },  
  AddManyToCart: async (products) => {
    try {
      const productsTotal = products.reduce((total, item) => {
        const price = item.product.sale
          ? item.product?.salePrice
          : item.product?.price;
        const count = item.count;
        return total + price * count;
      }, 0);

      const userCartResponse = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER
      );

      let userCart = userCartResponse?.data || { items: [], total: 0 , totalOfPrice: 0};
      const updatedCartProducts = [...userCart.items];

      products.forEach((productItem) => {
        const existingItemIndex = updatedCartProducts.findIndex(
          (cartItem) => cartItem.size === productItem.size
        );
        if (existingItemIndex !== -1) {
          updatedCartProducts[existingItemIndex].count += productItem.count;
        } else {
          updatedCartProducts.push(productItem);          
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
  DeleteFromCart: async (cartItem) => {
    try {
     //console.log("delete frrom to cart   ");
      // Lấy giỏ hàng hiện tại của người dùng
      const response = await axiosInstance.get(API_ENDPOINTS.GET_CART_BY_ID_USER);
      const userCart = response?.data;
  
      // Tìm sản phẩm cần xóa trong giỏ hàng
      let existingProduct = userCart?.items.find((item) => 
        item.product?.id === cartItem?.product?.id &&
        item.id === cartItem.id &&
        item.size === cartItem.size
      );
  
      let updatedItems;
      if (existingProduct) {
        // Loại bỏ sản phẩm khỏi giỏ hàng
        updatedItems = userCart.items.filter(
          (item) => !(item.product.id === existingProduct.product.id && item.id === existingProduct.id)
        );
      } else {
        // Nếu sản phẩm không tồn tại, giữ nguyên giỏ hàng
        updatedItems = [...userCart.items];
      }
  
      // Tính tổng giá trị giỏ hàng sau khi xóa sản phẩm
      const productPrice = existingProduct?.product?.sale
        ? existingProduct?.product?.salePrice * existingProduct?.count
        : existingProduct?.product?.price * existingProduct?.count;
  
      const updatedTotalOfPrice = userCart.totalOfPrice - productPrice;
  
      const totalOfProduct = updatedItems.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
  
      // Gửi cập nhật lên server
      const updateResponse = await axiosInstance.put(API_ENDPOINTS.UPDATE_CART, {
        items: updatedItems,
        totalOfPrice: updatedTotalOfPrice,
        totalOfProduct: totalOfProduct,
      });
      return updateResponse.data;
  
    } catch (error) {
      console.error("Failed to delete item from cart:", error);
      throw error;
    }
  },

};

export default cartRequests;
