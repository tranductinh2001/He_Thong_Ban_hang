import React, { useState, useEffect } from "react";
import { Rate, Modal, Input, Form, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderByUserId } from "../../redux/slices/orderSlice";

import reviewRequests from "../../redux/request/reviewRequests.js";

const RatingModal = ({ productId }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

  const orders = useSelector((state) => state?.order?.orderByUser || []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchOrderByUserId(userId));
    }
  }, [dispatch]);

  const hasPurchasedProduct = orders?.some((order) =>
    order?.products?.some((product) => product.id === Number(productId))
  );

  const showModal = (value) => {
    if (hasPurchasedProduct) {
      setRatingValue(value);
      setIsModalVisible(true);
    } else {
      message.warning("Bạn cần mua sản phẩm này trước khi đánh giá!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async (values) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID không tồn tại trong localStorage!");
      return;
    }

    const reviewData = {
      ...values,
      rating: ratingValue,
      productId: Number(productId),
      userId: Number(userId)
    };

    try {
      const response = await reviewRequests.create(reviewData);

      if (response) {
        message.success("Cảm ơn bạn đã gửi đánh giá!");
      } else {
        message.error("Đã xảy ra lỗi khi gửi đánh giá.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Đã xảy ra lỗi khi gửi đánh giá.");
    }

    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <Rate onChange={showModal} value={ratingValue} />
      <span className="text-sm">({ratingValue} đánh giá)</span>
      <Modal
        title="Đánh giá sản phẩm"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleOk}
          initialValues={{ rating: ratingValue }}
        >
          <Form.Item
            label="Tên của bạn"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>

          <Form.Item
            label="Nhận xét"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập nhận xét của bạn!" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RatingModal;
