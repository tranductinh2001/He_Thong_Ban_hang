import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Space,
  Upload,
  DatePicker,
  message,
} from "antd";

import { fetchCategoryList } from "../../../../../redux/slices/categorySlice.js";
import { fetchBrandList } from "../../../../../redux/slices/brandSlice.js";
import { fetchColorList } from "../../../../../redux/slices/colorSlice.js";
import { fetchSizeList } from "../../../../../redux/slices/sizeSlice.js";

import imageRequests from "../../../../../redux/request/imageRequests.js";
import productRequests from "../../../../../redux/request/productRequests.js";

const { Option } = Select;

const ProductForm = ({ type, product }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categoryList);
  const brands = useSelector((state) => state.brand.brandList);
  const colors = useSelector((state) => state.color.colorList);
  const sizes = useSelector((state) => state.size.sizeList);

  const normFile = (e) => {
    setFileList(e?.fileList);
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

  // Cập nhật dữ liệu sản phẩm vào form khi có sự thay đổi
  useEffect(() => {
    if (product && type === "edit") {
      form.setFieldsValue({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        colors: product.colors?.map((color) => color.id) || [],
        sizes: product.sizeList?.map((size) => size.id) || [],
        hot: product.hot,
        sale: product.sale,
        salePrice: product.salePrice,
        status: product.status,
        createdAt: product.createdAt ? moment(product.createdAt) : null,
        updatedAt: product.updatedAt ? moment(product.updatedAt) : null,
        images: product.images.map((img) => ({
          uid: img.id,
          name: img.name,
          status: "done",
          url: img.url,
        })),
      });
      setFileList(
        product.images.map((img) => ({
          uid: img.id,
          name: img.name,
          status: "done",
          url: img.url,
        }))
      );
    } else {
      form.resetFields();
    }
  }, [type, product, form]);

  useEffect(() => {
    dispatch(fetchCategoryList());
    dispatch(fetchBrandList());
    dispatch(fetchColorList());
    dispatch(fetchSizeList());
  }, [dispatch]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      if (values.images) {
        values.images.forEach((file) => {
          if (!file.url) {
            formData.append("file", file.originFileObj);
          }
        });
      }

      const uploadResponse = formData.has("file")
        ? await imageRequests.upload(formData)
        : [];

      const imageUrls = [
        ...values.images.map((file) => ({
          ...file,
          id: typeof file.uid !== "string" ? file.uid : undefined,
        })),
        ...uploadResponse,
      ];

      const body = {
        ...values,
        sizes: values.sizes.map((id) => sizes.find((size) => size.id === id)),
        images: imageUrls
          .filter((img) => img.id !== undefined)
          .map((img) => img.id),
      };

      if (type === "edit") {
        await productRequests.update(product.id, body);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productRequests.create(body);
        message.success("Tạo sản phẩm thành công!");
      }

      form.resetFields();
    } catch (error) {
      message.error("Đã xảy ra lỗi trong quá trình xử lý!");
    }
  };

  return (
    <Form
      name={`${type}_product`}
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
        name="images"
        label="Hình ảnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          { required: true, message: "Hãy upload ít nhất một hình ảnh!" },
        ]}
      >
        <Upload
          name="images"
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={({ fileList }) => setFileList(fileList)}
          onPreview={(file) => window.open(file.url || file.thumbUrl)}
        >
          {fileList.length >= 5 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá(VNĐ)"
        rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          formatter={(value) => {
            if (!value) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }}
        />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Thể loại"
        rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
      >
        <Select placeholder="Lựa chọn thể loại">
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="brandId"
        label="Nhãn hàng"
        rules={[{ required: true, message: "Vui lòng chọn nhãn hàng!" }]}
      >
        <Select placeholder="Lựa chọn nhãn hàng">
          {brands.map((brand) => (
            <Option key={brand.id} value={brand.id}>
              {brand.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="colors"
        label="Màu sắc"
        rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
      >
        <Select
          mode="multiple"
          value={form.getFieldValue("colors")}
          placeholder="Lựa chọn màu sắc"
          onChange={(value) => form.setFieldsValue({ colors: value })}
        >
          {colors.map((color) => (
            <Option key={color.id} value={color.id}>
              {color.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="sizes"
        label="Kích cỡ"
        rules={[{ required: true, message: "Vui lòng chọn kích cỡ!" }]}
      >
        <Select
          mode="multiple"
          placeholder="Lựa chọn kích cỡ"
          value={form.getFieldValue("sizes")}
          onChange={(value) => form.setFieldsValue({ sizes: value })}
        >
          {sizes.map((size) => (
            <Option key={size.id} value={size.id}>
              {size.sizeName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="isHot" label="Hot" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="isSale" label="Sale" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="salePrice" label="Giá sale(VNĐ)">
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          formatter={(value) => {
            if (!value) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }}
        />
      </Form.Item>

      <Form.Item name="status" label="Trạng thái" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="createdAt" label="Ngày tạo">
        <DatePicker
          style={{ width: "100%" }}
          value={form.getFieldValue("createdAt")}
          placeholder="Chọn ngày"
        />
      </Form.Item>

      <Form.Item name="updatedAt" label="Ngày cập nhật">
        <DatePicker
          style={{ width: "100%" }}
          value={form.getFieldValue("updatedAt")}
          placeholder="Chọn ngày"
        />
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

export default ProductForm;
