import { Table } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderByUserId } from "../../redux/slices/orderSlice";

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
    title: "Tổng giá trị (VND)",
    dataIndex: "totalOfPrice",
    key: "totalOfPrice",
    fixed: "left",
    render: (totalOfPrice) => totalOfPrice?.toLocaleString("vi-VN"),
  },
  {
    title: "Số điện thoại",
    dataIndex: "numberPhone",
    key: "numberPhone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Địa chỉ giao hàng",
    dataIndex: "orderAddress",
    key: "orderAddress",
  },
  {
    title: "Ghi chú",
    dataIndex: "notes",
    key: "notes",
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
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) =>
      date ? new Date(date).toLocaleDateString("vi-VN") : "Không có",
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "expiresAt",
    key: "expiresAt",
    render: (date) =>
      date ? new Date(date).toLocaleDateString("vi-VN") : "Không có",
  },
];

const OrdersForm = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state?.order?.orderByUser);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchOrderByUserId(userId));
    }
  }, [dispatch]);

  // console.log(orders)

  const onChange = (pagination, filters, sorter, extra) => {
   //console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <div className="container p-5 mx-auto">
        <Table
          columns={columns}
          dataSource={orders}
          onChange={onChange}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </div>
    </>
  );
};

export default OrdersForm;
