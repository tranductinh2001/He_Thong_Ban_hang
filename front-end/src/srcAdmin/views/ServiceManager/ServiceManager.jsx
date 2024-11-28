import { useEffect, useState, useRef } from "react";
import { CCardBody, CCardHeader, CRow, CButton } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceList } from "../../../redux/slices/serviceSlice.js";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Popconfirm, Modal, message } from "antd";
import Highlighter from "react-highlight-words";
import ColorForm from "../forms/FormAdmin/ColorForm/ColorForm.jsx";

import serviceRequests from "../../../redux/request/serviceRequests.js";

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

const ServiceManager = () => {
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
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      editable: true,
      ...getColumnSearchProps("name"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      fixed: "left",
      editable: true,
      ...getColumnSearchProps("description"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giá dịch vụ",
      dataIndex: "price",
      key: "price",
      render: (text) =>
        text?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Ảnh sản phẩm",
      key: "productImage",
      render: (_, record) => (
        <div>
          {record.product?.images?.length > 0 ? (
            <img
              src={record.product.images[0]?.url}
              alt="Product"
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ) : (
            "Chưa có ảnh"
          )}
        </div>
      ),
    },
    // {
    //   title: "Hành động",
    //   key: "action",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {[
    //         { color: "info", label: "Sửa" },
    //         { color: "danger", label: "Xóa", isDelete: true },
    //       ].map((item, index) =>
    //         item.isDelete ? (
    //           <Popconfirm
    //             key={index}
    //             title="Bạn chắc chắn xoá chứ?"
    //             onConfirm={() => handleDelete(record.id)}
    //           >
    //             <CButton color={item.color} shape="rounded-pill">
    //               {item.label}
    //               {item.name && (
    //                 <span style={{ fontWeight: "bold", color: "#FFA500" }}>
    //                   {" " + item.name}
    //                 </span>
    //               )}
    //             </CButton>
    //           </Popconfirm>
    //         ) : (
    //           <CButton
    //             color={item.color}
    //             shape="rounded-pill"
    //             key={index}
    //             onClick={() => showModal("edit", record)}
    //           >
    //             {item.label}
    //             {item.name && (
    //               <span style={{ fontWeight: "bold", color: "#FFA500" }}>
    //                 {" " + item.name}
    //               </span>
    //             )}
    //           </CButton>
    //         )
    //       )}
    //     </Space>
    //   ),
    // },
  ];

  //config table
  const { styles } = useStyle();
  const dispatch = useDispatch();
  const services = useSelector((state) => state.service.serviceList);

  const totalProductItems = services?.length;
  const pageSize = 10000; //Max

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (Number.isInteger(currentPage) && currentPage >= 1) {
      dispatch(fetchServiceList());
    }
  }, [dispatch, currentPage]);

  const handleTableChange = (pagination) => {
    if (pagination && pagination.current !== undefined) {
      setCurrentPage(pagination.current);
    }
  };

  //handle delete
  const handleDelete = async (serviceId) => {
    await serviceRequests.delete(serviceId);
    message.success("Xoá dịch vụ thành công!");
  };

  //config handle show form edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [typeModal, setTypeModal] = useState("");

  const showModal = (type, record) => {
    setSelectedRecord(record); // Lưu thông tin dịch vụ để chỉnh sửa
    setTypeModal(type);
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  return (
    <CRow>
      <CCardHeader className="justifil-conter">
        <strong>Quản lý danh sách dịch vụ</strong>
      </CCardHeader>
      <CCardBody>
        <div>
          {/* <Button
            type="primary"
            style={{
              marginBottom: 16,
              float: "right",
              size: 100,
            }}
            onClick={() => showModal("create", null)}
          >
            Thêm dịch vụ
          </Button> */}
          <Table
            scroll={{
              x: "max-content",
              y: 55 * 10,
            }}
            rowClassName="editable-row"
            bordered
            columns={columns}
            dataSource={services}
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
          title={typeModal === "edit" ? "Chỉnh sửa dịch vụ" : "Tạo mới dịch vụ"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null} // Nếu không muốn có nút footer
        >
          <ColorForm type={typeModal} color={selectedRecord} />
        </Modal>
      </CCardBody>
    </CRow>
  );
};

export default ServiceManager;
