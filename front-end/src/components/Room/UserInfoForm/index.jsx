"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Select, Form as AntForm, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { DeleteOutlined } from "@ant-design/icons";
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
  selectedImage: z.array(z.string()).optional(), // Changed to array for selected images
});

export default function UserInfoForm({ selectedImages }) {
  // console.log("ảnh được chọn trong UserInfoForm   ", selectedImages);
  const dispatch = useDispatch();

  const [filesFace, setFilesFace] = useState([]);
  const [fileListClothes, setFileListClothes] = useState([]);
  const formData1 = new FormData();

  useEffect(() => {
    if (selectedImages && selectedImages.length > 0) {
      // Xóa dữ liệu cũ trong formData
      formData1.delete("fileListClothes");
      setFileListClothes(selectedImages)
      // Chuyển đối tượng thành JSON string và append vào formData
    }
  }, [selectedImages]);


  // Xử lý upload file
  const handleUpload = async (file) => {
    // Giả sử bạn upload file ở đây và trả về thông tin file sau khi upload thành công
    return new Promise((resolve, reject) => {
      setFilesFace(file);
      formData1.append("image_face", file);
      setTimeout(() => {
        resolve(file);
      }, 2000); // Giả lập delay 2 giây
    });
  };


  const handleRemove = (file) => {
    // Thực hiện các bước xóa ảnh ở đây, ví dụ như gọi API để xóa ảnh khỏi server
    // Giả sử API trả về một Promise
    return new Promise((resolve, reject) => {
      setFilesFace([])
      formData1.append("image_face", file);
      setTimeout(() => {
        message.success("Đã xóa ảnh thành công");
        resolve(true); // Đánh dấu việc xóa thành công
      }, 1000);
    });
  };


  // Hàm xử lý gửi form
  async function onSubmit(values) {
    console.log("Dữ liệu từ form:", values); // Kiểm tra dữ liệu từ form

    try {
      const formData = new FormData();
      // Thêm các trường thông tin từ form vào FormData
      formData.append("weight", values.weight);
      formData.append("height", values.height);
      formData.append("skin_tone", values.skin_tone || "");
      formData.append("nationality", values.nationality || "");
      formData.append("hair_color", values.hair_color || "");
      formData.append("body_shape", values.body_shape || "");
      formData.append("hair_style", values.hair_style || "");
      formData.append("gender", values.gender);
      formData.append("age", values.age || "");
      formData.append("chest", values.chest || "");
      formData.append("wc", values.wc || "");
      formData.append("hip", values.hip || "");

      // Thêm ảnh khuôn mặt vào FormData
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
      toast.error("Failed to submit the form. Please try again.");
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
      initialValues={initialValues} // Đặt giá trị ban đầu ở đây
      onFinish={onSubmit} // Đảm bảo gọi onSubmit trực tiếp
      className="space-y-8 max-w-3xl mx-auto py-10 text-black"
    >
      {/* Image Upload at the top */}
      <div className="mb-8">
        <AntForm.Item label="Ảnh khuôn mặt" name="image_face">
          <Upload
            listType="picture"
            customRequest={({ file, onSuccess, onError }) => {
              handleUpload(file)
                .then((result) => {
                  onSuccess(result); // Gọi onSuccess khi upload thành công
                })
                .catch((err) => {
                  onError(err); // Gọi onError nếu có lỗi
                });
            }}
            // onChange={handleChange}
            onRemove={handleRemove}
            showUploadList={{
              showPreviewIcon: false, // Tắt icon preview nếu không cần
              showRemoveIcon: true,
              removeIcon: <Button icon={<DeleteOutlined />} />, // Icon xóa
            }}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </AntForm.Item>
      </div>

      {/* Weight and Height */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <AntForm.Item label="Cân nặng" name="weight">
            <Input type="number" />
          </AntForm.Item>
        </div>

        <div className="col-span-6">
          <AntForm.Item label="Chiều cao" name="height">
            <Input type="number" />
          </AntForm.Item>
        </div>
      </div>

      {/* Skin Tone and Nationality */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <AntForm.Item label="Tông da" name="skin_tone">
            <Input />
          </AntForm.Item>
        </div>

        <div className="col-span-6">
          <AntForm.Item label="Quốc tịch" name="nationality">
            <Input />
          </AntForm.Item>
        </div>
      </div>

      {/* Hair Color and Body Shape */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <AntForm.Item label="Màu tóc" name="hair_color">
            <Input />
          </AntForm.Item>
        </div>
        <div className="col-span-6">
          <AntForm.Item label="Dáng người" name="body_shape">
            <Input />
          </AntForm.Item>
        </div>
      </div>

      {/* Hair Style and Gender */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <AntForm.Item label="Kiểu tóc" name="hair_style">
            <Input />
          </AntForm.Item>
        </div>

        <div className="col-span-6">
          <AntForm.Item label="Giới tính" name="gender">
            <Select defaultValue="male">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </AntForm.Item>
        </div>
      </div>

      {/* Age, Chest, WC, Hip */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <AntForm.Item label="Độ tuổi" name="age">
            <Input type="number" />
          </AntForm.Item>
        </div>

        <div className="col-span-4">
          <AntForm.Item label="Số đo vòng 1" name="chest">
            <Input type="number" />
          </AntForm.Item>
        </div>

        <div className="col-span-4">
          <AntForm.Item label="Số đo vòng 2" name="wc">
            <Input type="number" />
          </AntForm.Item>
        </div>

        <div className="col-span-4">
          <AntForm.Item label="Số đo vòng 3" name="hip">
            <Input type="number" />
          </AntForm.Item>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <Button type="primary" htmlType="submit">
          Gửi
        </Button>
      </div>
    </AntForm>
  );
}
UserInfoForm.propTypes = {
  selectedImages: PropTypes.arrayOf(PropTypes.object),
};
