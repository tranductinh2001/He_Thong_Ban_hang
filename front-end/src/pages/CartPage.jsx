import { Button, Divider, Input, notification } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
import Model from "../components/Model";
import {
  addToCart,
  deleteFromCart,
  fetchCartData,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { fetchOrderAddress } from "../redux/slices/orderAddressSlice";
import { createCheckoutSession, createOrder } from "../redux/slices/orderSlice";
import { WebSocketProvider, useWebSocket } from "../WebSocket/WebSocketContext";

const { TextArea } = Input;

export default function CartPage() {
  const { receivedData } = useWebSocket();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const userId = useSelector((state) => state.auth?.currentUser);
  const cartData = useSelector((state) => state.cart?.products);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  //tổng giá tiền sản phẩm của giỏ hàng
  const total = useSelector((state) => state.cart?.total);
  // console.log("total   ", total);
  // tổng số lượng sản phẩm có trong giỏ hàng (tính cả size)
  const totalProduct = useSelector((state) => state.cart?.number_of_product);

  console.log("cartData ", cartData);
  // Tính tổng tiền giỏ hàng
  const calculatedTotal = cartData.reduce((total, item) => {
    // Kiểm tra xem có giảm giá hay không và sử dụng giá phù hợp
    const price =
      item?.product?.sale && item.product.salePrice
        ? item.product.salePrice // Nếu có giảm giá, lấy salePrice
        : item?.product?.price; // Nếu không có giảm giá, lấy giá gốc

    return total + price * item.count; // Tính tổng
  }, 0);
  console.log("calculatedTotal ", calculatedTotal);

  const priceSale = total - calculatedTotal;

  useEffect(() => {
    if (receivedData) {
      // Tách dữ liệu từ đối tượng
      const messageKey = Object.keys(receivedData)[0]; // Lấy key đầu tiên
      const messageValue = receivedData[messageKey]; // Lấy giá trị tương ứng

      setModalMessage(messageValue);
      if (modalMessage && modalMessage.trim() !== "") {
        setIsModalVisible(true); // Hiển thị modal
      }
    }
  }, [receivedData]);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  // console.log(currentUser)
  const [orderForm, setOrderForm] = useState({
    total_of_price: 0,
    order_address: {},
    cart: {},
    notes: "",
    number_phone: "",
    email: "",
    name: "",
  });

  //tổng tiền của giỏ hàng
  const default_address = useSelector(
    (state) => state.orderAddress?.defaultOrderAddress
  );
  // console.log(default_address)

  // xử lý thêm sản phẩm vào giỏ hàng trên strapi
  const handleAddToCart = (product) => {
    // console.log("đã vào được call api này với data   ", product);
    dispatch(addToCart({ product }));
  };
  const handleRemoveFromCart = (product) => {
    // console.log("đã vào được call api này với data   ", product);
    dispatch(removeFromCart({ product }));
  };
  const handleDeleteFromCart = (cartItem) => {
    // console.log("đã vào được call api này với data   ", cartItem);
    dispatch(deleteFromCart({ cartItem }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  //kiểm tra số lượng sản phẩm trước khi thanh toán (số lương sp có vượt quá tồn kho hay ko)
  const checkQuantityCartItem = () => {
    // console.log(cartData)
    return cartData.every((cartItem) =>
      cartItem.product?.sizeList.some(
        (sizeItem) =>
          cartItem.size === sizeItem.sizeName &&
          cartItem.count <= sizeItem.quantity
      )
    );
  };
  //xử lý nút đặt hàng
  const handleOrder = () => {
    dispatch(fetchCartData());
    if (checkQuantityCartItem()) {
      setIsModalVisible(true); // Hiển thị modal
      // console.log(orderForm);
      // console.log(cartData);
      // console.log("order address", default_address);
      // console.log("total price", total);
      const order = {
        email: orderForm.email,
        numberPhone: orderForm.number_phone,
        notes: orderForm.notes || "",
        orderAddress: default_address ?? currentUser?.address,
        cart: cartData,
        totalOfPrice: total,
        name: orderForm.name,
      };
      console.log("data oderr nè:   ", order);
      // dispatch(createOrder(order));
      dispatch(createCheckoutSession(order));
      if (messageError) {
        api.warning({
          messageError: "Thông báo",
          description: (
            <div>
              {messageError}
              <br />
              <Link className="text-blue-600 underline" to={prevPaymentUrl}>
                Đơn hàng chưa thanh toán
              </Link>
            </div>
          ),
          duration: 0,
        });
      }
    } else alert("Số lượng sản phẩm trong giỏ hạn vượt quá sản phẩm tồn kho");
  };

  const messageError = useSelector((state) => state.order?.error);
  //link thanh toán đơn hàng trước đó đang có trạng thái pending
  const prevPaymentUrl = useSelector((state) => state.order?.prevPaymentUrl);
  //link chuyển hướng đến stripe
  const paymentUrl = useSelector((state) => state.order?.paymentUrl);
  const isLoading = useSelector((state) => state.order?.loading);
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        dispatch(fetchOrderAddress(userId));
      }
      dispatch(fetchCartData());
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setOrderForm({
        number_phone: currentUser?.numberPhone,
        email: currentUser?.email,
        // order_address: currentUser?.
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  return (
    <>
      {" "}
      {!isAuthenticated || cartData?.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 p-2 sm:flex-row md:p-4">
            {/* thông tin vận chuyển */}
            <div className="flex flex-col h-full gap-2 basis-1/2">
              <div className="p-2 mb-2 bg-gray-300 rounded-t-lg">
                <span className="text-xl font-semibold text-neutral-700">
                  THÔNG TIN VẬN CHUYỂN
                </span>
              </div>
              <div className="flex flex-col gap-3 text-xs sm:flex-row">
                <div className="flex flex-col gap-2">
                  <span className="text-sm">Số điện thoại</span>
                  <Input
                    id="number_phone"
                    name="number_phone"
                    value={orderForm?.number_phone}
                    className="pr-20 rounded-full"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm">Email</span>
                  <Input
                    id="number_phone"
                    name="email"
                    value={orderForm?.email}
                    className="pr-20 rounded-full"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Địa chỉ  */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="text-sm">Địa chỉ</span>
                <TextArea
                  name="address"
                  allowClear
                  className="rounded-lg"
                  onChange={handleChange}
                />
                {/* <Link to="" className="text-blue-600">
                    Địa chỉ khác
                  </Link> */}
                <span className="text-lg font-semibold">
                  {default_address?.name}
                </span>
                <p className="text-base text-gray-500">
                  {default_address?.address}
                </p>
              </div>
              {/* Ghi chú */}
              <div>
                <span className="text-sm">Ghi chú</span>
                <TextArea
                  name="notes"
                  allowClear
                  className="rounded-lg"
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* divider */}
            {/* giỏ hàng */}
            {contextHolder}
            <div className="flex flex-col pl-3 border-l-0 border-gray-300 basis-1/2 sm:border-l">
              <div className="p-2 mb-2 bg-gray-300 rounded-t-lg">
                <span className="text-xl font-semibold text-neutral-700">
                  GIỎ HÀNG
                </span>
              </div>
              {cartData?.map((cartItem, index) => (
                <CartItem
                  key={index}
                  cartItem={cartItem}
                  size={cartItem.size}
                  productQuantity={cartItem.count}
                  addToCart={(cartItem) => handleAddToCart(cartItem)}
                  removeFromCart={(cartItem) => handleRemoveFromCart(cartItem)}
                  deleteFromCart={(cartItem) => handleDeleteFromCart(cartItem)}
                />
              ))}
              {/* tổng tiền */}
              <div>
                <Divider />
                <div className="flex flex-row items-center justify-between">
                  <span>Tạm tính</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1.2, 1.3, 1] }}
                    transition={{ duration: 0.4 }}
                  >
                    {total?.toLocaleString()}đ
                  </motion.span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>Giảm giá</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1.2, 1.3, 1],
                      fontWeight: [800, 500],
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-semibold text-red-500"
                  >
                    -{priceSale?.toLocaleString()}đ
                  </motion.span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>Tổng</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1.2, 1.3, 1],
                      fontWeight: [800, 500],
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-semibold text-red-500"
                  >
                    {calculatedTotal?.toLocaleString()}đ
                  </motion.span>
                </div>
                <Divider />
              </div>
              <Button onClick={handleOrder} danger type="primary">
                <span size="large" className="text-lg">
                  Đặt hàng
                </span>
              </Button>
            </div>
          </div>
          <Model
            title="Thông báo" // Tiêu đề của modal
            message={modalMessage} // Nội dung thông báo
            isVisible={isModalVisible} // Trạng thái hiển thị
            onClose={closeModal} // Đóng modal
          />{" "}
        </>
      )}
    </>
  );
}
