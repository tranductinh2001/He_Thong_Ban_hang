import {
  Alert,
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdateUser } from "../../redux/slices/userSlice";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import imageRequests from "../../redux/request/imageRequests";
export default function PersonalInformationForm() {
  const dispatch = useDispatch();
  const isSuccessUpdate = useSelector((state) => state.user?.success);
  const isLoadingUpdate = useSelector((state) => state.user?.loading);
  const isErrorUpdate = useSelector((state) => state.user?.error);
  const currentUser = useSelector((state) => state.auth?.currentUser);
  // console.log("ảnh ", currentUser);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [avatar, setAvatar] = useState(null);

  // Hiển thị thông báo khi cập nhật thành công
  useEffect(() => {
    if (isSuccessUpdate) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessUpdate]);

  const normFile = (e) => {
    // console.log("Event: ", e); // Kiểm tra dữ liệu từ sự kiện
    if (e?.fileList?.length > 0) {
      setAvatar(e.fileList[0].url || e.fileList[0].thumbUrl);
    } else {
      setAvatar(null);
    }
    return e?.fileList;
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

  // Đổ dữ liệu từ currentUser vào form
  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        numberPhone: currentUser.numberPhone || "",
        email: currentUser.email || "",
        dob: currentUser.dob ? moment(currentUser.dob) : null,
        address: currentUser.address || "",
      });

      // Đổ ảnh nếu đã có
      if (currentUser?.avatar) {
        setFileList([
          {
            uid: "-1", // Một UID bất kỳ
            name: "avatar.png", // Tên hiển thị
            status: "done", // Đánh dấu đã hoàn thành
            url: currentUser.avatar, // URL của ảnh
          },
        ]);
      }
    }
  }, [currentUser, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Thêm ảnh vào formData
      if (fileList?.length > 0) {
        formData.append("file", fileList[0].originFileObj); // Thêm file chính xác
      }

      // console.log("formData    ", formData);
      // Upload ảnh lên server
      const uploadResponse = formData.has("file")
        ? await imageRequests.upload(formData)
        : "";

      // console.log("Upload Response: ", uploadResponse);

      // Chuẩn bị dữ liệu gửi API
      const body = {
        ...values,
        username: currentUser?.username,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : "",
        avatarUrl: uploadResponse?.length
          ? uploadResponse[0]?.url
          : currentUser?.avatar, // URL ảnh mới hoặc giữ nguyên ảnh cũ
      };

      dispatch(fetchUpdateUser({ data: body, id: currentUser?.id }));
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      // Thông báo thành công
      message.success("Cập nhật người dùng thành công!");

      // Reset form và avatar
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình cập nhật!");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="flex flex-col w-full p-4"
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        THÔNG TIN TÀI KHOẢN
      </h1>

      <div className="flex justify-center mb-6">
        <Image
          width={200}
          className="rounded-full border-4 border-gray-200 shadow-lg l-40"
          src={currentUser?.avatarUrl}
          alt="Avatar"
        />
      </div>

      {isLoadingUpdate ? (
        <Button type="primary" loading className="w-full mb-4">
          Đang cập nhật tài khoản
        </Button>
      ) : (
        <>
          {visible && (
            <Alert
              message="Cập nhật tài khoản thành công"
              description="Tài khoản của bạn đã được thay đổi thành công. Vui lòng kiểm tra thông tin tài khoản."
              type="success"
              showIcon
              className="mb-4"
            />
          )}
          {isErrorUpdate && (
            <Alert
              message="Cập nhật tài khoản thất bại"
              description="Vui lòng thao tác cập nhật lại tài khoản."
              type="error"
              showIcon
              className="mb-4"
            />
          )}
        </>
      )}

      <br />

      <Form.Item
        label="Họ và chữ lót"
        name="firstName"
        rules={[{ required: true, message: "Vui lòng nhập họ và chữ lót" }]}
      >
        <Input placeholder="Họ và chữ lót" />
      </Form.Item>

      <Form.Item
        label="Tên"
        name="lastName"
        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
      >
        <Input placeholder="Tên" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="numberPhone"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
      >
        <Input placeholder="Số điện thoại" />
      </Form.Item>

      <Form.Item label="Email" name="email">
        <Input placeholder="Email" disabled />
      </Form.Item>

      <Form.Item
        label="Ngày sinh"
        name="dob"
        rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
      >
        <Input placeholder="Địa chỉ" />
      </Form.Item>

      <Form.Item
        label="Tải lên ảnh đại diện"
        name="avatarUrl"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="avatarUrl"
          listType="picture"
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
          }}
          beforeUpload={beforeUpload}
          onChange={(info) => {
            const updatedFileList = info.fileList.slice(-1); // Chỉ giữ lại file cuối cùng
            setFileList(updatedFileList);

            if (info.file.status === "done") {
              setAvatar(info.file.response?.url || info.file.thumbUrl); // Lấy URL của ảnh
            }
          }}
          fileList={fileList}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        className="w-full"
        loading={isLoadingUpdate}
      >
        Cập nhật
      </Button>
    </Form>
  );
}
