import React, { useEffect, useState, useRef } from "react";
import { CCardBody, CCardHeader, CRow, CButton } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductList,
  setActiveFilter,
} from "../../../redux/slices/productSlice";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag, Popconfirm, Modal } from "antd";
import Highlighter from "react-highlight-words";
import EditProductForm from "../forms/editFormAdmin/editProductForm/editProductForm";

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
const ProductManager = () => {
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      editable: true,
      ...getColumnSearchProps("name"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) =>
        images && images.length > 0 ? (
          <img
            src={images[0]?.url} // Đảm bảo `url` là thuộc tính chứa đường dẫn ảnh
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      ...getColumnSearchProps("price"),
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Brand",
      dataIndex: ["brand", "name"],
      key: "brand",
      ...getColumnSearchProps("brand", "name"),
    },
    {
      title: "Colors",
      dataIndex: "colors",
      key: "colors",
      ...getColumnSearchProps("colors"),
      render: (colors) => (
        <>
          {colors.map((color) => (
            <Tag key={color.id}>{color.name}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Size List",
      dataIndex: "sizeList",
      key: "sizeList",
      ...getColumnSearchProps("sizeList"),
      render: (sizes) => (
        <>
          {sizes.map((size) => (
            <Tag key={size.id}>{size.sizeName}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Hot",
      dataIndex: "hot",
      key: "hot",
      ...getColumnSearchProps("hot"),
      render: (hot) => (
        <Tag color={hot ? "gold" : "default"}>{hot ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
      ...getColumnSearchProps("sale"),
      render: (sale) => (
        <Tag color={sale ? "green" : "default"}>{sale ? "On Sale" : "No"}</Tag>
      ),
    },
    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      ...getColumnSearchProps("salePrice"),
      render: (salePrice) =>
        salePrice ? `${salePrice.toLocaleString()} VND` : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      ...getColumnSearchProps("updatedAt"),
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "N/A",
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          {[
            { color: "info", label: "Sửa" },
            {
              color: "danger",
              label: "Xóa",
              isDelete: true,
            },
          ].map((item, index) =>
            item.isDelete ? (
              <Popconfirm
                key={index}
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key)}
              >
                <CButton color={item.color} shape="rounded-pill">
                  {item.label}
                  {item.name && (
                    <span style={{ fontWeight: "bold", color: "#FFA500" }}>
                      {" " + item.name}
                    </span>
                  )}
                </CButton>
              </Popconfirm>
            ) : (
              <CButton
                color={item.color}
                shape="rounded-pill"
                key={index}
                onClick={() => showEditModal(record)}
              >
                {item.label}
                {item.name && (
                  <span style={{ fontWeight: "bold", color: "#FFA500" }}>
                    {" " + item.name}
                  </span>
                )}
              </CButton>
            )
          )}
        </Space>
      ),
    },
  ];

  //config table
  const { styles } = useStyle();
  const dispatch = useDispatch();
  const productListByPage = useSelector(
    (state) => state.products.combinedProductList
  );
  const totalProductItems = useSelector((state) => state.products.totalItems);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (Number.isInteger(currentPage) && currentPage >= 1) {
      dispatch(setActiveFilter({ title: 0, sort: 0 }));
      dispatch(fetchProductList({ currentPage: currentPage, pageSize }));
    }
  }, [dispatch, currentPage]);

  const handleTableChange = (pagination) => {
    if (pagination && pagination.current !== undefined) {
      setCurrentPage(pagination.current);
    }
  };

  //handle delete
  const handleDelete = (key) => {};

  //config handle show form edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const showEditModal = (record) => {
    setSelectedRecord(record); // Lưu thông tin sản phẩm để chỉnh sửa
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  return (
    <CRow>
      <CCardHeader className="justifil-conter">
        <strong>Quản lý danh sách sản phẩm</strong>
      </CCardHeader>
      <CCardBody>
        <div>
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              float: "right",
              size: 100,
            }}
          >
            Add a row
          </Button>
          <Table
            scroll={{
              x: "max-content",
              y: 55 * 10,
            }}
            rowClassName="editable-row"
            bordered
            columns={columns}
            dataSource={productListByPage}
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
        <Modal
          title="Edit Product"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null} // Nếu không muốn có nút footer
        >
          <EditProductForm product={selectedRecord} />
        </Modal>
      </CCardBody>
    </CRow>
  );
};

export default ProductManager;
