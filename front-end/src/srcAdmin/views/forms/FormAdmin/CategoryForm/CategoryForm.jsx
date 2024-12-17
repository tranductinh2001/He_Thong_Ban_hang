import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  message,
} from "antd";

import categoryRequests from "../../../../../redux/request/categoryRequests.js";
import { fetchCategoryList } from "../../../../../redux/slices/categorySlice.js";
import { useDispatch } from "react-redux";

const CategoryForm = ({ setIsModalVisible, type, category }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (category && type === "edit") {
      form.setFieldsValue({
        id: category.id,
        name: category.name,
      });
    } else {
      form.resetFields();
    }
  }, [type, category, form]);

  const onFinish = async (values) => {
    try {
      const body = {
        ...values,
      };
      if (type === "edit") {
        await categoryRequests.update(category.id, body);
        message.success("Cập nhật thể loại thành công!");
      } else {
        await categoryRequests.create(body);
        message.success("Tạo thể loại thành công!");
      }
      dispatch(fetchCategoryList());
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình xử lý!");
    }
  };

  return (
    <Form
      name={`${type}_category`}
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
        rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
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

export default CategoryForm;
