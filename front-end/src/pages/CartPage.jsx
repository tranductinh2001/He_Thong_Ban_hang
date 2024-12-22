import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Input, Select, notification } from "antd";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
import Model from "../components/Model";
import { useWebSocket } from "../WebSocket/WebSocketContext";
import {
  addToCart,
  deleteFromCart,
  fetchCartData,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { fetchOrderAddress } from "../redux/slices/orderAddressSlice";
import { createCheckoutSession } from "../redux/slices/orderSlice";

const { TextArea } = Input;
const { Option } = Select;

export default function CartPage() {
  const dispatch = useDispatch();
  const { receivedData } = useWebSocket();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const userId = useSelector((state) => state.auth?.currentUser);
  const cartData = useSelector((state) => state.cart?.products);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const total = useSelector((state) => state.cart?.total);
  const order_addresses = useSelector(
    (state) => state.orderAddress?.order_addresses
  );
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const messageError = useSelector((state) => state.order?.error);
  const prevPaymentUrl = useSelector((state) => state.order?.prevPaymentUrl);
  const paymentUrl = useSelector((state) => state.order?.paymentUrl);
  const isLoading = useSelector((state) => state.order?.loading);

  const [orderForm, setOrderForm] = useState({
    total_of_price: 0,
    order_address: {},
    cart: {},
    notes: "",
    number_phone: "",
    email: "",
    name: "",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);

  const calculatedTotal = cartData?.reduce((total, item) => {
    const price =
      item?.product?.sale && item.product.salePrice
        ? item?.product?.salePrice
        : item?.product?.price;
    return total + price * item?.count;
  }, 0);
  const priceSale = total - calculatedTotal;

 //console.log("cartData", cartData);
 //console.log("total", total);
 //console.log("priceSale", priceSale);
 //console.log("calculatedTotal", calculatedTotal);

  useEffect(() => {
    if (receivedData) {
      const messageKey = Object.keys(receivedData)[0];
      const messageValue = receivedData[messageKey];
      setModalMessage(messageValue);
      if (modalMessage && modalMessage.trim() !== "") {
        setIsModalVisible(true);
      }
    }
  }, [receivedData]);

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        dispatch(fetchOrderAddress(userId));
      }
      dispatch(fetchCartData());
    }
  }, [currentUser, isAuthenticated, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setOrderForm((prev) => ({
        ...prev,
        number_phone: currentUser?.numberPhone,
        email: currentUser?.email,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const defaultAddr = order_addresses?.find((item) => item.isDefault);
    if (defaultAddr) {
      setSelectedAddress(defaultAddr);
      setOrderForm((prev) => ({
        ...prev,
        order_address: defaultAddr.address,
        name: defaultAddr.name,
      }));
    }
  }, [order_addresses]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const closeModal = () => setIsModalVisible(false);

  const handleAddToCart = (product) => dispatch(addToCart({ product }));
  const handleRemoveFromCart = (product) =>
    dispatch(removeFromCart({ product }));
  const handleDeleteFromCart = (cartItem) =>
    dispatch(deleteFromCart({ cartItem }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (value) => {
    const address = order_addresses.find((item) => item.id === value);
    setSelectedAddress(address);
    setOrderForm((prev) => ({ ...prev, order_address: address.address }));
  };

  const handleNameChange = (value) => {
    const address = order_addresses.find((item) => item.id === value);
    setSelectedAddress(address);
    setOrderForm((prev) => ({ ...prev, name: address.name }));
  };

  const checkQuantityCartItem = () => {
    return cartData.every((cartItem) =>
      cartItem.product?.sizeList.some(
        (sizeItem) =>
          cartItem.size === sizeItem.sizeName &&
          cartItem.count <= sizeItem.quantity
      )
    );
  };

  const handleOrder = () => {
    dispatch(fetchCartData());
    if (checkQuantityCartItem()) {
      setIsModalVisible(true);
      const order = {
        email: orderForm.email,
        numberPhone: orderForm.number_phone,
        notes: orderForm.notes || "",
        orderAddress: orderForm.order_address ?? currentUser?.address,
        cart: cartData,
        totalOfPrice: total,
        name: orderForm.name,
      };
      dispatch(createCheckoutSession(order));
      if (messageError) {
        api.warning({
          message: "Thông báo",
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
    } else {
      alert("Số lượng sản phẩm trong giỏ hàng vượt quá sản phẩm tồn kho");
    }
  };

  if (!isAuthenticated || cartData?.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {contextHolder}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Shipping Information */}
        <div className="lg:w-1/2">
          <h2 className="p-3 mb-4 text-2xl font-bold bg-gray-100 rounded-t-lg">
            THÔNG TIN VẬN CHUYỂN
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="number_phone"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Số điện thoại
                </label>
                <Input
                  id="number_phone"
                  name="number_phone"
                  value={orderForm?.number_phone}
                  onChange={handleChange}
                  className="w-full rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={orderForm?.email}
                  onChange={handleChange}
                  className="w-full rounded-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Chọn tên
              </label>
              <Select
                id="name"
                placeholder="Chọn tên"
                className="w-full rounded-md"
                value={orderForm?.name}
                onChange={handleNameChange}
              >
                {order_addresses?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Chọn địa chỉ
              </label>
              <Select
                id="address"
                placeholder="Chọn địa chỉ"
                className="w-full rounded-md"
                value={orderForm?.order_address}
                onChange={handleAddressChange}
              >
                {order_addresses?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.address}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Ghi chú
              </label>
              <TextArea
                id="notes"
                name="notes"
                value={orderForm?.notes}
                onChange={handleChange}
                className="w-full rounded-md"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="lg:w-1/2">
          <h2 className="p-3 mb-4 text-2xl font-bold bg-gray-100 rounded-t-lg">
            GIỎ HÀNG
          </h2>
          <div className="space-y-4">
            {cartData?.map((cartItem, index) => (
              <CartItem
                key={index}
                cartItem={cartItem}
                size={cartItem.size}
                productQuantity={cartItem.count}
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
                deleteFromCart={handleDeleteFromCart}
              />
            ))}
          </div>
          <div className="pt-4 mt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Tạm tính</span>
              <motion.span
                key={total}
                initial={{ scale: 1 }}
                animate={{ scale: [1.2, 1.3, 1] }}
                transition={{ duration: 0.4 }}
                className="font-semibold"
              >
                {total?.toLocaleString()}đ
              </motion.span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Giảm giá</span>
              <motion.span
                key={priceSale}
                initial={{ scale: 1 }}
                animate={{ scale: [1.2, 1.3, 1] }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-red-500"
              >
                {priceSale?.toLocaleString()}đ
              </motion.span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Tổng</span>
              <motion.span
                key={calculatedTotal}
                initial={{ scale: 1 }}
                animate={{ scale: [1.2, 1.3, 1] }}
                transition={{ duration: 0.3 }}
                className="text-red-500"
              >
                {calculatedTotal?.toLocaleString()}đ
              </motion.span>
            </div>
          </div>
          <Button
            onClick={handleOrder}
            type="primary"
            danger
            className="w-full h-12 mt-4 text-lg font-semibold"
          >
            Đặt hàng
          </Button>
        </div>
      </div>
      <Model
        title="Thông báo"
        message={modalMessage}
        isVisible={isModalVisible}
        onClose={closeModal}
      />
    </div>
  );
}
