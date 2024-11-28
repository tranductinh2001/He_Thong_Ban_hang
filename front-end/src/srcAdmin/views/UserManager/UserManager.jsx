import { useEffect, useState, useRef } from "react";
import { CCardBody, CCardHeader, CRow, CButton } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../../../redux/slices/userSlice.js";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Popconfirm, Modal, message } from "antd";
import Highlighter from "react-highlight-words";
import UserForm from "../forms/FormAdmin/UserForm/UserForm.jsx";

import userRequests from "../../../redux/request/userRequests.js";

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

const UserManager = () => {
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
      title: "Email",
      dataIndex: "username",
      key: "username",
      fixed: "left",
      editable: true,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Ảnh",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      fixed: "left",
      editable: true,
      render: (text) => (
        <img
          src={text || "default-avatar-url.jpg"}
          alt="Avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Họ",
      dataIndex: "firstName",
      key: "firstName",
      editable: true,
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
      editable: true,
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "numberPhone",
      key: "numberPhone",
      editable: true,
      ...getColumnSearchProps("numberPhone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      editable: true,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      editable: true,
      ...getColumnSearchProps("dob"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      editable: true,
      ...getColumnSearchProps("createdAt"),
      render: (text) => new Date(text).toLocaleString(), // Định dạng ngày giờ
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      editable: true,
      ...getColumnSearchProps("updatedAt"),
      render: (text) => new Date(text).toLocaleString(), // Định dạng ngày giờ
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          {[
            { color: "info", label: "Sửa" },
            { color: "danger", label: "Xóa", isDelete: true },
          ].map((item, index) =>
            item.isDelete ? (
              <Popconfirm
                key={index}
                title="Bạn chắc chắn xoá chứ?"
                onConfirm={() => handleDelete(record.id)}
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
                onClick={() => showModal("edit", record)}
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
  const users = useSelector((state) => state.user.userList);

  const totalProductItems = users?.length;
  const pageSize = 10000; //Max

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (Number.isInteger(currentPage) && currentPage >= 1) {
      dispatch(fetchUserList());
    }
  }, [dispatch, currentPage]);

  const handleTableChange = (pagination) => {
    if (pagination && pagination.current !== undefined) {
      setCurrentPage(pagination.current);
    }
  };

  //handle delete
  const handleDelete = async (userId) => {
    await userRequests.delete(userId);
    message.success("Xoá người dùng thành công!");
  };

  //config handle show form edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [typeModal, setTypeModal] = useState("");

  const showModal = (type, record) => {
    setSelectedRecord(record); // Lưu thông tin người dùng để chỉnh sửa
    setTypeModal(type);
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  return (
    <CRow>
      <CCardHeader className="justifil-conter">
        <strong>Quản lý danh sách người dùng</strong>
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
            dataSource={users}
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
          title={
            typeModal === "edit" ? "Chỉnh sửa người dùng" : "Tạo mới người dùng"
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <UserForm type={typeModal} user={selectedRecord} />
        </Modal>
      </CCardBody>
    </CRow>
  );
};

export default UserManager;
