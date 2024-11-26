import { FaYoutube, FaFacebook } from "react-icons/fa";
import React from "react";
import _Breadcrumb from "../components/Breadcrumb";

export default function ContactPage() {
  return (
    <div>
      <_Breadcrumb title={"Liên hệ"} />
      <div className="w-full h-full p-4">
        <div className="flex items-start justify-center gap-2 px-2 mx-4 bg-white rounded-xl">
          <div className="flex flex-col items-start justify-start h-full gap-2">
            <h1 className="w-full p-2 mb-2 text-xl font-semibold bg-gray-300 rounded-t-lg">Thông tin liên hệ</h1>
            <p>
              Địa chỉ: 638/45/4 Lê Trọng Tấn - Bình Hưng Hoà - Bình Tân - TPHCM
            </p>
            <p>
              Điện thoại: 0985639992
              {/* <FaYoutube size={40} /> */}
            </p>
            <p>
              E-mail:{" "}
              <a href="mailto:voxuanvuloc@gmail.com">voxuanvuloc@gmail.com</a>
            </p>
            <div className="flex items-center justify-start gap-2">
              <a
                href="https://www.facebook.com/trung.han.2506/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={40} />
              </a>
              <a
                href="https://www.youtube.com/@hanquoctrung3343"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={40} />
              </a>
            </div>
          </div>
          <div className="flex flex-col w-3/5">
            <h1 className="w-full p-2 mb-4 text-xl font-semibold bg-gray-300 rounded-t-lg">
              Liên hệ với chúng tôi
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  id="surnName"
                  name="surnName"
                  className="p-2 text-sm font-semibold border rounded"
                  placeholder="Họ tên của bạn"
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="p-2 text-sm font-semibold border rounded"
                  placeholder="Email của bạn"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <input
                type="text"
                id="phone"
                name="phone"
                className="p-2 text-sm font-semibold border rounded"
                placeholder="Điện thoại của bạn"
              />
            </div>
            <div className="flex flex-col mb-4">
              <textarea
                type="text"
                id="email"
                name="email"
                className="p-2 text-sm font-semibold border rounded h-60"
                placeholder="Ghi chú"
              />
            </div>
            <button className="flex items-center justify-center w-32 p-3 text-sm font-semibold text-white duration-300 bg-blue-500 border-2 border-blue-500 align-self h-11 rounded-xl hover:bg-white hover:text-blue-600">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
