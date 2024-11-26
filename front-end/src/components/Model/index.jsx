import React from "react";
import { Modal, Button, Typography, Space } from "antd";
import { MailOutlined, CloseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Text } = Typography;

const Model = ({ title, message, isVisible, onClose }) => {
  // Hàm điều hướng đến Gmail
  const handleGoToGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  // Kiểm tra nếu message chứa chữ "successfully"
  const containsSuccess = message && message.includes("successfully");

  // Tách nội dung message nếu là object
  const parsedMessage =
    typeof message === "object" && message !== null
      ? Object.entries(message).map(([key, value]) => (
          <div key={key}>
            <Text strong>{key}:</Text> <Text>{value}</Text>
          </div>
        ))
      : message;

  return (
    <Modal
      title={<Text strong style={{ fontSize: "18px" }}>{title}</Text>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Text style={{ fontSize: "16px" }}>{parsedMessage}</Text>
        </div>

        <Space style={{ justifyContent: "flex-end", width: "100%" }}>
          {/* Hiển thị nút "Đi tới Gmail" với hiệu ứng chỉ khi message chứa "successfully" */}
          {containsSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Button 
                type="default" 
                icon={<MailOutlined />} 
                onClick={handleGoToGmail} 
                style={{ background: "#f0f0f0", color: "#000" }}
              >
                Đi tới Gmail
              </Button>
            </motion.div>
          )}
          <Button 
            type="primary" 
            danger 
            icon={<CloseOutlined />} 
            onClick={onClose}
          >
            Đóng
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default Model;
