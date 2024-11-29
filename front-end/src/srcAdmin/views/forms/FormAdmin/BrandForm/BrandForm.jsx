import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  message,
} from "antd";

import brandRequests from "../../../../../redux/request/brandRequests.js";

const BrandForm = ({ type, brand }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (brand && type === "edit") {
      form.setFieldsValue({
        id: brand.id,
        name: brand.name,
      });
    } else {
      form.resetFields();
    }
  }, [type, brand, form]);

  const onFinish = async (values) => {
    try {
      const body = {
        ...values,
      };
      if (type === "edit") {
        await brandRequests.update(brand.id, body);
        message.success("Cập nhật nhãn hàng thành công!");
      } else {
        await brandRequests.create(body);
        message.success("Tạo nhãn hàng thành công!");
      }
      form.resetFields();
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình xử lý!");
    }
  };

  return (
    <Form
      name={`${type}_brand`}
      onFinish={onFinish}
      form={form}
      initialValues={{
        status: true,
        hot: false,
        sale: false,
        rate: 3.5,
      }}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="name"
        label="Tên"
        rules={[{ required: true, message: "Vui lòng nhập tên nhãn hàng!" }]}
      >
        <Input />
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

export default BrandForm;
