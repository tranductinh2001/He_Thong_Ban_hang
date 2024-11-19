import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Space,
  Upload,
  DatePicker,
  Row,
} from "antd";
import axios from "axios";

const { Option } = Select;

const sizes = [
  { id: "1", label: "S" },
  { id: "2", label: "M" },
  { id: "3", label: "L" },
  { id: "4", label: "XL" },
  { id: "5", label: "XXL" },
  { id: "6", label: "XS" },
];

const colors = [
  { id: "1", name: "Đỏ" },
  { id: "2", name: "Xanh dương" },
  { id: "3", name: "Xanh lá" },
  { id: "4", name: "Vàng" },
  { id: "5", name: "Đen" },
];

const EditProductForm = ({ product }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [productData, setProductData] = useState(null);

  const normFile = (e) => {
    setFileList(e?.fileList);
    return e?.fileList;
  };

  // Cập nhật dữ liệu sản phẩm vào form khi có sự thay đổi
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category?.name, // Set category ID
        brand: product.brand?.name, // Set brand ID
        colors: product?.colors?.map((color) => color.name) || [],
        sizeList: product?.sizeList?.map((size) => size.sizeName) || [], // Đặt giá trị ban đầu cho sizeList
        hot: product.hot,
        sale: product.sale,
        salePrice: product.salePrice,
        status: product.status,
        createdAt: product.createdAt ? moment(product.createdAt) : null, // Format date using moment
        updatedAt: product.updatedAt ? moment(product.updatedAt) : null, // Format date using moment
      });
    }
  }, [product, form]);

  const onFinish = (values) => {
    console.log("Success:", values);

    // Gửi API cập nhật sản phẩm
  };

  return (
    <Form
      name="edit_product"
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
        name="id"
        label="ID"
        rules={[{ required: true, message: "ID is required" }]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the product name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="images"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="images" listType="picture" beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please enter the price!" }]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          formatter={(value) => `${value} VND`}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select a category!" }]}
      >
        <Select placeholder="Select Category">
          <Option value="1">Thời trang nam</Option>
          <Option value="2">Category 2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="brand"
        label="Brand"
        rules={[{ required: true, message: "Please select a brand!" }]}
      >
        <Select placeholder="Select Brand">
          <Option value="1">Nike</Option>
          <Option value="2">Brand 2</Option>
        </Select>
      </Form.Item>

      <Form.Item name="colors" label="Colors">
    <Checkbox.Group>
      <Row>
        {colors.map((color) => (
          <Col span={8} key={color.id}>
            <Checkbox value={color.name}>
              {color.name}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  </Form.Item>

  <Form.Item name="sizeList" label="Sizes">
    <Checkbox.Group>
      <Row>
        {sizes.map((size) => (
          <Col span={8} key={size.id}>
            <Checkbox value={size.label}>
              {`${size.label} (${product?.sizeList?.find((item) => item.sizeName === size.label)?.quantity || 0} available)`}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  </Form.Item>

      <Form.Item name="hot" label="Hot" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="sale" label="Sale" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="salePrice" label="Sale Price">
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          formatter={(value) => `${value} VND`}
        />
      </Form.Item>

      <Form.Item name="status" label="Status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="createdAt" label="Created At">
        <DatePicker
          style={{ width: "100%" }}
          value={form.getFieldValue("createdAt")}
        />
      </Form.Item>

      <Form.Item name="updatedAt" label="Updated At">
        <DatePicker
          style={{ width: "100%" }}
          value={form.getFieldValue("updatedAt")}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="reset">Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EditProductForm;
