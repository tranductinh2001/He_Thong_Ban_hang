import { Table, Badge, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddAddressForm from "./addAddressForm";
import {
  fetchOrderAddress,
  setDefaultOrderAddress,
} from "../../redux/slices/orderAddressSlice";

const AddressForm = () => {
  const dispatch = useDispatch();
  // const currentUser = useSelector((state) => state.auth?.currentUser);
  const order_addresses = useSelector(
    (state) => state.orderAddress?.order_addresses
  );
  
  const [dataSource, setdataSource] = useState([]); // Khởi tạo state là mảng trống
  
  useEffect(() => {
    if (order_addresses) {
      const updatedDataSource = order_addresses.map(item => ({
        ...item,
        key: item.id, // Đảm bảo `id` là duy nhất
      }));
      setdataSource(updatedDataSource);
    }
  }, [order_addresses]);
  
    
  

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Đặt làm mặc định",
      dataIndex: "isDefault",
      key: "isDefault",
      sorter: (a, b) => b - a,
      render: (isDefault) =>
        isDefault ? (
          <Badge status="success" text="Mặc định" />
        ) : (
          <Badge status="default" text="Không" />
        ),
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (_, record) =>
        !record.is_default && (
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Đặt làm mặc định
          </Button>
        ),
    },
  ];

  const handleEdit = (order_address_id) => {
    // console.log(order_address_id);
    dispatch(setDefaultOrderAddress(order_address_id));
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchOrderAddress(userId));
    }
  }, [dispatch]);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <div className="container p-5 mx-auto">
        <div className="size-full">
          <AddAddressForm />
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
          onChange={onChange}
          scroll={{ y: 500 }}
        />
      </div>
    </>
  );
};

export default AddressForm;
