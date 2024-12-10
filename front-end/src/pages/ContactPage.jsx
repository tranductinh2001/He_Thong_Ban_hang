import { useState } from "react";
import { message } from "antd";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import _Breadcrumb from "../components/Breadcrumb";

import contactRequests from "../redux/request/contactRequests";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });

  const [formStatus, setFormStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitContactForm = async () => {
    const { fullName, email, phoneNumber, notes } = formData;

    if (!fullName || !email || !phoneNumber || !notes) {
      setFormStatus("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    await contactRequests.create(formData);
    message.success("Gửi thành công");
    setFormData({
      surnName: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  return (
    <div>
      <_Breadcrumb title={"Liên hệ"} />
      <div className="w-full h-full p-4">
        <div className="flex flex-wrap items-start justify-center gap-2 px-2 mx-4 bg-white rounded-xl">
          <div className="flex flex-col items-start justify-start h-full gap-2">
            <h1 className="w-full p-2 mb-2 text-xl font-semibold bg-gray-300 rounded-t-lg">
              Thông tin liên hệ
            </h1>
            <p>
              Địa chỉ: 79 biên cương, phường Ngô Mây, TP.Quy Nhơn, tỉnh Bình
              Định
            </p>
            <p>Điện thoại: 0352911750</p>
            <p>
              E-mail:{" "}
              <a href="mailto:tinhkkhoat@gmail.com">tinhkkhoat@gmail.com</a>
            </p>
            <div className="flex items-center justify-start gap-2">
              <a
                href="https://www.facebook.com/tinhstart123/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={40} />
              </a>
              <a
                href="https://www.youtube.com/@tranuctinh-ktpm6943"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={40} />
              </a>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-3/5">
            <h1 className="w-full p-2 mb-4 text-xl font-semibold bg-gray-300 rounded-t-lg">
              Liên hệ với chúng tôi
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="p-2 text-sm font-semibold border rounded"
                  placeholder="Họ tên của bạn"
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-2 text-sm font-semibold border rounded"
                  placeholder="Email của bạn"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="p-2 text-sm font-semibold border rounded"
                placeholder="Điện thoại của bạn"
              />
            </div>
            <div className="flex flex-col mb-4">
              <textarea
                type="text"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="p-2 text-sm font-semibold border rounded h-60"
                placeholder="Ghi chú"
              />
            </div>
            <button
              onClick={submitContactForm}
              className="flex items-center justify-center w-32 p-3 text-sm font-semibold text-white duration-300 bg-blue-500 border-2 border-blue-500 align-self h-11 rounded-xl hover:bg-white hover:text-blue-600"
            >
              Gửi
            </button>
            {formStatus && (
              <p className="mt-4 text-sm font-semibold text-green-500">
                {formStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
