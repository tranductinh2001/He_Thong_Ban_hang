"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Select, Form as AntForm, Upload, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createModelInRoom } from "../../../redux/slices/roomSlice";

const { Option } = Select;

const formSchema = z.object({
  weight: z.string(),
  height: z.string(),
  skin_tone: z.string().optional(),
  nationality: z.string().optional(),
  hair_color: z.string().optional(),
  body_shape: z.string().optional(),
  hair_style: z.string().optional(),
  gender: z.string(),
  age: z.number().optional(),
  chest: z.number().optional(),
  wc: z.number().optional(),
  hip: z.number().optional(),
  image_face: z.string().optional(),
  selectedImage: z.array(z.string()).optional(),
});

export default function UserInfoForm({
  setIsSubmitting,
  selectedImage,
  productId,
}) {
  console.log("productId   ", productId);
  const dispatch = useDispatch();
  const [filesFace, setFilesFace] = useState([]);
  const [fileListClothes, setFileListClothes] = useState(null);
  const [fileFace, setFileFace] = useState(null);
  const [fileClothes, setFileClothes] = useState(null);
  const formData1 = new FormData();

  useEffect(() => {
    if (selectedImage) {
      // Xóa dữ liệu cũ trong formData
      formData1.delete("fileListClothes");
      setFileListClothes(selectedImage)
      // Chuyển đối tượng thành JSON string và append vào formData
    }
  }, [selectedImage]);

  const handleUpload = async (file) => {
    return new Promise((resolve) => {
      setFilesFace(file);
      formData1.append("image_face", file);
      setTimeout(() => resolve(file), 2000);
    });
  };

  const handleRemove = () => {
    return new Promise((resolve) => {
      setFilesFace([]);
      formData1.append("image_face", null);
      setTimeout(() => {
        message.success("Đã xóa ảnh thành công");
        resolve(true);
      }, 1000);
    });
  };

  async function onSubmit(values) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      formData.append("product_id", productId || "");
      if (filesFace) {
        formData.append("image_face", filesFace);
      }
      formData.append("fileListClothes", JSON.stringify(fileListClothes));

      // In tất cả dữ liệu trong FormData
      formData.forEach((value, key) => {
        console.log(`Key: ${key}, Value:`, value);
      });

      dispatch(createModelInRoom({ data: formData }));

      toast.success("Dữ liệu đã được gửi thành công!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Không thể gửi biểu mẫu. Vui lòng thử lại.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  }

  const initialValues = {
    weight: "",
    height: "",
    skin_tone: "",
    nationality: "",
    hair_color: "",
    body_shape: "",
    hair_style: "",
    gender: "",
    age: "",
    chest: "",
    wc: "",
    hip: "",
  };

  return (
    <AntForm
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      className="max-w-3xl mx-auto space-y-4 text-black"
    >
      <div className="mb-4">
        <AntForm.Item label="Ảnh khuôn mặt" name="image_face">
          <Upload
            listType="picture"
            customRequest={({ file, onSuccess, onError }) => {
              handleUpload(file).then(onSuccess).catch(onError);
            }}
            onRemove={handleRemove}
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: true,
              removeIcon: <Button icon={<DeleteOutlined />} />,
            }}
          >
            <Button icon={<UploadOutlined />} className="w-full sm:w-auto">
              Tải ảnh lên
            </Button>
          </Upload>
        </AntForm.Item>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AntForm.Item label="Cân nặng" name="weight">
          <Input type="number" className="w-full" />
        </AntForm.Item>

        <AntForm.Item label="Chiều cao" name="height">
          <Input type="number" className="w-full" />
        </AntForm.Item>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AntForm.Item label="Tông da" name="skin_tone">
          <Input className="w-full" />
        </AntForm.Item>

        <AntForm.Item label="Quốc tịch" name="nationality">
          <Input className="w-full" />
        </AntForm.Item>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AntForm.Item label="Màu tóc" name="hair_color">
          <Input className="w-full" />
        </AntForm.Item>
        <AntForm.Item label="Dáng người" name="body_shape">
          <Input className="w-full" />
        </AntForm.Item>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AntForm.Item label="Kiểu tóc" name="hair_style">
          <Input className="w-full" />
        </AntForm.Item>

        <AntForm.Item label="Giới tính" name="gender">
          <Select defaultValue="male" className="w-full">
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
          </Select>
        </AntForm.Item>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AntForm.Item label="Độ tuổi" name="age">
          <Input type="number" className="w-full" />
        </AntForm.Item>

        <AntForm.Item label="Số đo vòng 1" name="chest">
          <Input type="number" className="w-full" />
        </AntForm.Item>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AntForm.Item label="Số đo vòng 2" name="wc">
          <Input type="number" className="w-full" />
        </AntForm.Item>

        <AntForm.Item label="Số đo vòng 3" name="hip">
          <Input type="number" className="w-full" />
        </AntForm.Item>
      </div>

      <div className="flex justify-center mt-8">
        <Button type="primary" htmlType="submit" className="w-full sm:w-auto">
          Gửi
        </Button>
      </div>
    </AntForm>
  );
}

UserInfoForm.propTypes = {
  setIsSubmitting: PropTypes.any,
  productId: PropTypes.any.isRequired,
  selectedImage: PropTypes.arrayOf(PropTypes.string), // Sửa tên và kiểu dữ liệu
};
