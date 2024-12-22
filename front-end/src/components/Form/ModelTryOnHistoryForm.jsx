import { Table, Button,Image } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchModelTryOnHistoryList } from "../../redux/slices/modelTryOnHistorySlice";
import { useNavigate } from "react-router-dom";

import modelTryOnHistoryRequests from "../../redux/request/modelTryOnHistoryRequests";

const ModelTryOnHistoryForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modelTryOnHistories = useSelector(
    (state) => state?.modelTryOnHistory?.modelTryOnHistoryList
  );
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchModelTryOnHistoryList(userId));
    }
  }, [dispatch]);

  const handleDelete = async (id) => {
    await modelTryOnHistoryRequests.delete(id);
    const userId = localStorage.getItem("userId");
    dispatch(fetchModelTryOnHistoryList(userId));
  };

  const onChange = (pagination, filters, sorter, extra) => {
   //console.log("params", pagination, filters, sorter, extra);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 70,
      render: (id) => id.toString(),
    },
    {
      title: "Cân nặng (kg)",
      dataIndex: "weight",
      key: "weight",
      render: (weight) => weight || "Không có",
    },
    {
      title: "Chiều cao (cm)",
      dataIndex: "height",
      key: "height",
      render: (height) => height || "Không có",
    },
    {
      title: "Màu da",
      dataIndex: "skinTone",
      key: "skinTone",
      render: (skinTone) => skinTone || "Không có",
    },
    {
      title: "Quốc tịch",
      dataIndex: "nationality",
      key: "nationality",
      render: (nationality) => nationality || "Không có",
    },
    {
      title: "Màu tóc",
      dataIndex: "hairColor",
      key: "hairColor",
      render: (hairColor) => hairColor || "Không có",
    },
    {
      title: "Kiểu tóc",
      dataIndex: "hairStyle",
      key: "hairStyle",
      render: (hairStyle) => hairStyle || "Không có",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => gender || "Không có",
    },
    {
      title: "Vòng 1",
      dataIndex: "chest",
      key: "chest",
      render: (chest) => chest || "Không có",
    },
    {
      title: "Vòng eo",
      dataIndex: "wc",
      key: "wc",
      render: (wc) => wc || "Không có",
    },
    {
      title: "Vòng hông",
      dataIndex: "hip",
      key: "hip",
      render: (hip) => hip || "Không có",
    },
    {
      title: "Ngày tạo",
      dataIndex: "triedAt",
      key: "triedAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "Không có",
    },
    {
      title: "Ảnh AI tạo",
      dataIndex: "createdImageGenerateAI",
      key: "createdImageGenerateAI",
      render: (image) =>
        image ? (
          <div className="relative group">
            {" "}
            {/* Thêm group để dễ dàng kiểm soát hover */}
            {/* Kiểm tra ảnh có tải không */}
            <Image
              src={image?.url || "/default_image.png"} // Ảnh mặc định nếu không có URL hợp lệ
              alt={image?.name || "Ảnh AI"}
              className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-xl cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            />
          </div>
        ) : (
          "Không có ảnh AI tạo"
        ),
    },
    {
      key: "action_delete",  // Đổi key để phân biệt
      fixed: "right",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button danger onClick={() => handleDelete(record.id)}>
            Xoá
          </Button>
        </div>
      ),
    },
    {
      key: "action_view",  // Đổi key cho cột 'Xem chi tiết'
      fixed: "right",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            onClick={() => {
              if (record?.product?.id) {
                navigate(`/product/${record.product.id}`);
              } else {
                console.error("No product_id found for this record.", record);
              }
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container p-5 mx-auto">
      <Table
        columns={columns}
        dataSource={modelTryOnHistories}
        onChange={onChange}
        rowKey="id"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ModelTryOnHistoryForm;
