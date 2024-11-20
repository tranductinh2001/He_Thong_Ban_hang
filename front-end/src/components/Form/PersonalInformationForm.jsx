import { Alert, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdateUser } from "../../redux/slices/userSlice";

export default function PersonalInformationForm() {
  const isSuccessUpdate = useSelector((state) => state.user?.success);
  const isLoadingUpdate = useSelector((state) => state.user?.loading);
  const isErrorUpdate = useSelector((state) => state.user?.error);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const [visible, setVisible] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    number_phone: "",
    email: "",
    dob: "",
    address: "",
  });

  useEffect(() => {
    if (isSuccessUpdate) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // Điều chỉnh thời gian (mili giây) nếu cần
      return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }
  }, [isSuccessUpdate]);

  useEffect(() => {
    if (currentUser) {
      const dob = currentUser.dob
        ? new Date(currentUser.dob).toISOString().split("T")[0]
        : "";
      setFormData({
        id: currentUser._id || "",
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        number_phone: currentUser.number_phone || "",
        email: currentUser.email || "",
        dob: dob,
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data: ", formData);

    dispatch(fetchUpdateUser({ data: formData }));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <form className="flex flex-col w-full p-4" onSubmit={handleSubmit}>
      <h1 className="mb-4 text-xl font-semibold">THÔNG TIN TÀI KHOẢN</h1>
      {isLoadingUpdate ? (
        <>
          <Button type="primary" loading className="ml-2">
            Đang cập nhật tài khoản.
          </Button>
        </>
      ) : (
        <>
          {visible ? (
            <Alert
              message="Cập nhật tài khoản thành công"
              description="tài khoản của bạn đã được thay đổi thành công vui lòng kiểm tra thông tin tài khoản."
              type="success"
              showIcon
              t
            />
          ) : (
            <>
              {isErrorUpdate ? (
                <Alert
                  message="Cập nhật tài khoản thất bại"
                  description="vui lòng thao tác cập nhật lại tài khoản."
                  type="error"
                  showIcon
                />
              ) : (
                <></>
              )}
            </>
          )}
        </>
      )}

      <br />
      <div className="flex flex-col items-center justify-start mb-4 sm:flex-row sm:space-x-4">
        <div className="flex flex-col">
          <label htmlFor="first_name" className="mb-2 text-sm font-semibold">
            Họ và chữ lót
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="p-2 text-sm font-semibold border rounded"
            placeholder={formData.first_name}
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="last_name" className="mb-2 text-sm font-semibold">
            Tên
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="p-2 text-sm font-semibold border rounded"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="number_phone" className="mb-2 text-sm font-semibold">
          Số điện thoại
        </label>
        <input
          type="text"
          id="number_phone"
          name="number_phone"
          className="p-2 text-sm font-semibold border rounded"
          value={formData.number_phone}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="email" className="mb-2 text-sm font-semibold">
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          className="p-2 text-sm font-semibold border rounded"
          value={formData.email}
          onChange={handleChange}
          disabled={true}
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="birthday" className="mb-2 text-sm font-semibold">
          Ngày sinh
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          className="p-2 border rounded"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="address" className="mb-2 text-sm font-semibold">
          Địa chỉ
        </label>
        <input
          type="text"
          id="address"
          name="address"
          className="p-2 text-sm font-semibold border rounded"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center w-32 p-3 text-sm font-semibold text-white duration-300 bg-blue-500 border-2 border-blue-500 align-self h-11 rounded-xl hover:bg-white hover:text-blue-600"
      >
        Cập nhật
      </button>
    </form>
  );
}
