import { Table, Button } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchModelTryOnHistoryList } from "../../redux/slices/modelTryOnHistorySlice";
import { useNavigate } from 'react-router-dom';

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
    console.log("params", pagination, filters, sorter, extra);
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
      title: "Ảnh mặt",
      dataIndex: "faceImageId",
      key: "faceImageId",
      render: (imageId) => (imageId ? `Ảnh ID: ${imageId}` : "Không có"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "CANCELED", value: "CANCELED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color;
        switch (status) {
          case "PENDING":
            color = "orange";
            break;
          case "COMPLETED":
            color = "green";
            break;
          case "CANCELED":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Xoá
        </Button>
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
        onRow={(record) => ({
          onClick: () => {
            if (record?.product?.id) {
              navigate(`/product/${record?.product?.id}`);
            } else {
              console.error('No product_id found for this record.', record);
            }
          },
        })}
      />
    </div>
  );
};

export default ModelTryOnHistoryForm;
