import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Upload, message, DatePicker } from "antd";
import moment from "moment";

import imageRequests from "../../../../../redux/request/imageRequests.js";
import userRequests from "../../../../../redux/request/userRequests";

const UserForm = ({ type, user }) => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user && type === "edit") {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        numberPhone: user.numberPhone,
        address: user.address,
        dob: user.dob ? moment(user.dob) : null,
      });
      setAvatar(user.avatarUrl);
    } else {
      form.resetFields();
      setAvatar(null);
    }
  }, [type, user, form]);

  const normFile = (e) => {
    if (e.fileList.length > 0) {
      const uploadedAvatar = e.fileList[0].url || e.fileList[0].thumbUrl;
      setAvatar(uploadedAvatar);
    } else {
      setAvatar(null);
    }
    return e.fileList;
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file hình ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      if (values.avatarUrl && values.avatarUrl.length > 0) {
        formData.append("file", values.avatarUrl[0]?.originFileObj);
      } else if (avatar) {
        formData.append("file", avatar);
      }

      const uploadResponse = formData.has("file")
        ? await imageRequests.upload(formData)
        : "";

      const body = {
        ...values,
        avatarUrl: uploadResponse.length ? uploadResponse[0]?.url : avatar,
      };

      if (type === "edit") {
        await userRequests.update(user.id, body);
        message.success("Cập nhật người dùng thành công!");
      } else {
        await userRequests.create(body);
        message.success("Tạo người dùng thành công!");
      }

      form.resetFields();
      setAvatar(null); // Reset avatar sau khi submit
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình xử lý!");
    }
  };

  return (
    <Form
      name={`${type}_user`}
      onFinish={onFinish}
      form={form}
      initialValues={{
        status: true,
      }}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="username"
        label="Tên người dùng"
        rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="firstName"
        label="Tên"
        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Họ"
        rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="numberPhone"
        label="Số điện thoại"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="address" label="Địa chỉ">
        <Input />
      </Form.Item>

      <Form.Item
        name="dob"
        label="Ngày sinh"
        rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="avatarUrl"
        label="Ảnh đại diện"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Hình ảnh đại diện của người dùng"
      >
        <Upload
          name="avatarUrl"
          listType="picture-card"
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
          }}
          beforeUpload={beforeUpload}
          onChange={normFile}
          fileList={avatar ? [{ url: avatar }] : []}
          maxCount={1}
        >
          {!avatar && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {type === "edit" ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button htmlType="reset">Huỷ</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
