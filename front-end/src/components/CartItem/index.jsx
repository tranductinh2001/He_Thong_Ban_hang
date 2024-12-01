import { Button, Image, Input, InputNumber, Popconfirm, Space } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
const { TextArea } = Input;

export const QuantityEditor = ({
  max,
  min,
  value,
  onIncrement,
  onDecrement,
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const increment = () => {
    // console.log("cộng trong cart item")
    if (currentValue < max) {
      const newValue = currentValue + 1;
      setCurrentValue(newValue);
      onIncrement(newValue);
    }
  };

  const decrement = () => {
    // console.log("trừ trong cart item")
    if (currentValue > min) {
      const newValue = currentValue - 1;
      setCurrentValue(newValue);
      onDecrement(newValue);
    }
  };

  return (
    <Space className="flex items-center">
      <Button
        icon={<FaMinus />}
        onClick={decrement}
        disabled={currentValue <= min}
      />
      <InputNumber
        min={min}
        max={max}
        value={currentValue}
        readOnly
        className="text-center"
      />
      <Button
        icon={<FaPlus />}
        onClick={increment}
        disabled={currentValue >= max}
      />
      

    </Space>
  );
};

export const DeleteConfirmButton = ({ onConfirm }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.3 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Popconfirm
        title="Xóa sản phẩm này khỏi giỏ hàng?"
        placement="left"
        // description="Xác nhận xóa sản phẩm ra khỏi giỏ hàng?"
        onConfirm={onConfirm}
        // onCancel={cancel}
        icon={
          <CiWarning
            size={25}
            style={{
              color: "red",
            }}
          />
        }
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button size="small" type="text" danger>
          <FaTrashAlt size={15} />
        </Button>
      </Popconfirm>
    </motion.div>
  );
};

const CartItem = ({
  productQuantity,
  cartItem,
  size,
  addToCart,
  removeFromCart,
  deleteFromCart,
}) => {
  // console.log(cartItem?.product);
  const [quantity, setQuantity] = useState(productQuantity);
  const foundItem = cartItem?.product?.sizeList?.find(
    (item) => item.sizeName === size
  );
  const handleIncrement = (newValue) => {
    if (newValue <= foundItem.quantity) {
      setQuantity(newValue);
      addToCart(cartItem, newValue);
    }
  };

  const handleDecrement = (newValue) => {
    if (newValue >= 1) {
      setQuantity(newValue);
      removeFromCart(cartItem, newValue);
    }
  };

  const handleDeleteCartItem = () => {
    deleteFromCart(cartItem);
  };

  // console.log("cart item count", quantity);
  return (
    <div className="flex flex-row gap-3">
      <div className="">
        <Image
          className="rounded-2xl"
          width={170}
          height={170}
          src={cartItem?.product?.images[0]?.url ?? "/src/assets/default_image.png"}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <span className="font-semibold">{cartItem?.product?.name}</span>
          <DeleteConfirmButton onConfirm={handleDeleteCartItem} />
        </div>
        <span className="px-2 text-white bg-gray-500 rounded-md w-fit">{size}</span>
        {quantity > foundItem?.quantity ? (
          <span className="text-xs text-red-600">
            Số lượng sản phẩm trong kho còn{" "}
            <span className="font-extrabold ">
              {foundItem ? foundItem?.quantity : 0}
            </span>{" "}
            (vượt quá sản phẩm)
          </span>
        ) : (
          <span className="text-xs text-green-600">
            Số lượng sản phẩm trong kho còn{" "}
            <span className="font-extrabold">
              {foundItem ? foundItem?.quantity : 0}
            </span>
          </span>
        )}
        {!cartItem?.product?.sale ? (
          <span className="font-semibold text-red-500">
            {cartItem?.product?.price?.toLocaleString()}đ
          </span>
        ) : (
          <>
            <span className="text-sm font-semibold text-red-500 line-through">
              {cartItem?.product?.price?.toLocaleString()}đ
            </span>
            <span className="font-semibold text-green-500">
              {cartItem?.product?.salePrice?.toLocaleString()}đ
              </span>

          </>
        )}

        <div className="flex flex-row items-center justify-between">
          <QuantityEditor
            max={foundItem?.quantity}
            min={1}
            value={productQuantity}
            setValue={setQuantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </div>
      </div>
    </div>
  );
};
export default CartItem;
