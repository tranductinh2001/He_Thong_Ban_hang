import { useEffect, useState, useRef } from "react";
import { CCardBody, CCardHeader, CRow } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../redux/slices/orderSlice.js";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, message } from "antd";
import Highlighter from "react-highlight-words";

import orderRequests from "../../../redux/request/orderRequests.js";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const OrderManager = () => {
  //config search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 70,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Tổng giá trị (VND)",
      dataIndex: "totalOfPrice",
      key: "totalOfPrice",
      fixed: "left",
      render: (totalOfPrice) => totalOfPrice.toLocaleString("vi-VN"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "numberPhone",
      key: "numberPhone",
      ...getColumnSearchProps("numberPhone"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
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
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleChangeStatus(record, "COMPLETED")}
            disabled={record.status === "COMPLETED"}
          >
            Hoàn thành
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleChangeStatus(record, "CANCELED")}
            disabled={record.status === "CANCELED"}
          >
            Huỷ
          </Button>
        </Space>
      ),
    },
  ];

  //config table
  const { styles } = useStyle();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);

  const totalProductItems = orders?.length;
  const pageSize = 10000; //Max

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (Number.isInteger(currentPage) && currentPage >= 1) {
      dispatch(fetchOrders());
    }
  }, [dispatch, currentPage]);

  const handleTableChange = (pagination) => {
    if (pagination && pagination.current !== undefined) {
      setCurrentPage(pagination.current);
    }
  };

  const handleChangeStatus = async (record, newStatus) => {
    try {
      await orderRequests.UpdateOrderStatus(record.id, newStatus);
      message.success(`Đã chuyển trạng thái đơn hàng sang ${newStatus}`);
      dispatch(fetchOrders());
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <CRow>
      <CCardHeader className="justifil-conter">
        <strong>Quản lý danh sách đơn hàng</strong>
      </CCardHeader>
      <CCardBody>
        <div>
          <Table
            scroll={{
              x: "max-content",
              y: 55 * 10,
            }}
            rowClassName="editable-row"
            bordered
            columns={columns}
            dataSource={orders}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalProductItems,
            }}
            onChange={handleTableChange}
            rowKey="id"
            className={styles.customTable}
          />
        </div>
      </CCardBody>
    </CRow>
  );
};

export default OrderManager;
