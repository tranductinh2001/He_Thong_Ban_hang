import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  message,
} from "antd";

import colorRequests from "../../../../../redux/request/colorRequests.js";
import { fetchColorList } from "../../../../../redux/slices/colorSlice.js";
import { useDispatch } from "react-redux";

const ColorForm = ({ setIsModalVisible, type, color }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (color && type === "edit") {
      form.setFieldsValue({
        id: color.id,
        name: color.name,
      });
    } else {
      form.resetFields();
    }
  }, [type, color, form]);

  const onFinish = async (values) => {
    try {
      const body = {
        ...values,
      };
      if (type === "edit") {
        await colorRequests.update(color.id, body);
        message.success("Cập nhật màu sắc thành công!");
      } else {
        await colorRequests.create(body);
        message.success("Tạo màu sắc thành công!");
      }
      dispatch(fetchColorList());
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình xử lý!");
    }
  };

  return (
    <Form
      name={`${type}_color`}
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
        rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
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

export default ColorForm;
