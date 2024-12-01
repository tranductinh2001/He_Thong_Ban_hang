import React, { useEffect, useState, useRef } from "react";
import { CCardBody, CCardHeader, CRow, CButton } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactList } from "../../../redux/slices/contactSlice.js";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, message } from "antd";
import Highlighter from "react-highlight-words";

import contactRequests from "../../../redux/request/contactRequests.js";

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

const ContactManager = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  const handleOpenModal = (contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentContact(null);
  };

  const handleSendReply = () => {
    message.success("Phản hồi đã được gửi!");
    handleCloseModal();
  };

  // Config search
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
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
      ...getColumnSearchProps("id"),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <CButton color="primary" onClick={() => handleOpenModal(record)}>
          Trả lời
        </CButton>
      ),
    },
  ];

  const { styles } = useStyle();
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact.contactList);

  useEffect(() => {
    dispatch(fetchContactList());
  }, [dispatch]);

  return (
    <CRow>
      <CCardHeader>
        <strong>Quản lý danh sách liên hệ</strong>
      </CCardHeader>
      <CCardBody>
        <Table
          bordered
          columns={columns}
          dataSource={contacts}
          rowKey="id"
          className={styles.customTable}
        />
      </CCardBody>

      <Modal
        title="Trả lời liên hệ"
        open={isModalOpen}
        onOk={handleSendReply}
        onCancel={handleCloseModal}
        okText="Gửi"
        cancelText="Hủy"
      >
        <p>Phản hồi đến: {currentContact?.fullName}</p>
        <Input.TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
      </Modal>
    </CRow>
  );
};

export default ContactManager;
