import { Button, Divider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getProvincesWithDetail } from "vietnam-provinces";
import { fetchCreateOrderAddress } from "../../redux/slices/orderAddressSlice";
import { fetchUpdateRelationUser } from "../../redux/slices/userSlice";
function AddAddressForm() {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dataProvinces, setDataProvinces] = useState({});

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [valueProvince, setValueProvicce] = useState(null);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [valueWard, setValueWard] = useState(null);

  const [optionsProvices, setOptionsProvices] = useState([]);
  const [optionsDistricts, setOptionsDistricts] = useState([]);
  const [optionsWards, setOptionsWards] = useState([]);

  const currentUser = useSelector((state) => state.auth?.currentUser);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvincesWithDetail();
        setDataProvinces(response);

        const provincesArray = Object.values(response);
        const formattedOptions = provincesArray.map((province) => ({
          value: province.code,
          label: province.name,
        }));

        setOptionsProvices(formattedOptions);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (valueProvince) {
      const selectedProvince = dataProvinces[valueProvince.value];
      const districtsArray = selectedProvince?.districts
        ? Object.values(selectedProvince.districts)
        : [];

      const formattedDistricts = districtsArray.map((district) => ({
        value: district.code,
        label: district.name,
      }));

      setOptionsDistricts(formattedDistricts);
      setOptionsWards([]);
    }
  }, [valueProvince, dataProvinces]);

  useEffect(() => {
    if (valueDistrict) {
      const selectedProvince = dataProvinces[valueProvince.value];
      const selectedDistrict = selectedProvince?.districts[valueDistrict.value];
      const wardsArray = selectedDistrict?.wards
        ? Object.values(selectedDistrict.wards)
        : [];

      const formattedWards = wardsArray.map((ward) => ({
        value: ward.code,
        label: ward.name,
      }));

      setOptionsWards(formattedWards);
    }
  }, [valueDistrict, dataProvinces, valueProvince]);

  const changeHandlerProvice = (selectedOption) => {
    setValueProvicce(selectedOption);
    setValueDistrict(null);
    setValueWard(null);
  };

  const changeHandlerDistric = (selectedOption) => {
    setValueDistrict(selectedOption);
    setValueWard(null);
  };

  const changeHandlerWard = (selectedOption) => {
    setValueWard(selectedOption);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const formData = {
      name,
      address:
        address +
        ", " +
        valueWard.label +
        ", " +
        valueDistrict.label +
        ", " +
        valueProvince.label,
      isDefault: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user_id: userId,
    };
    // console.log("form data", formData)
    try {
      const createdOrderAddress = await dispatch(
        fetchCreateOrderAddress(formData)
      ).unwrap();

      // console.log("orderAddressId ", createdOrderAddress.id);

      if (createdOrderAddress && createdOrderAddress.id) {
        dispatch(
          fetchUpdateRelationUser({
            userId: currentUser?.id,
            orderAddressId: createdOrderAddress.id,
          })
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(
        "Error creating order address or updating relation:",
        error
      );
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={showModal}
        className="w-40 h-12 px-4 py-2 mb-4 text-xs font-bold text-white duration-300 bg-green-600 hover:border-2 hover:border-green-600 hover:bg-white hover:text-green-500 rounded-xl"
      >
        THÊM ĐỊA CHỈ
      </button>
      <Modal
        title="Thêm Cửa hàng"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Thêm địa chỉ
          </Button>,
        ]}
      >
        <div className="flex flex-col w-full">
          <Divider />
          <div className="w-full mb-4">
            <label htmlFor="name" className="mb-2 text-sm font-semibold">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-sm font-semibold border rounded"
            />
          </div>
          <div className="flex flex-row flex-1 mb-4 space-x-4">
            <div className="flex-1">
              <label htmlFor="address" className="mb-2 text-sm font-semibold">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 text-sm font-semibold border rounded"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="province" className="mb-2 text-sm font-semibold">
                Tỉnh thành
              </label>
              <Select
                options={optionsProvices}
                value={valueProvince}
                onChange={changeHandlerProvice}
                placeholder={"chọn tỉnh"}
              />
            </div>
          </div>
          <div className="flex flex-row flex-1 w-full mb-4 space-x-4">
            <div className="flex-1">
              <label htmlFor="district" className="mb-2 text-sm font-semibold">
                Quận huyện
              </label>
              <Select
                options={optionsDistricts}
                value={valueDistrict}
                onChange={changeHandlerDistric}
                isDisabled={!valueProvince}
                placeholder={"chọn quận huyện"}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="ward" className="mb-2 text-sm font-semibold">
                Phường xã
              </label>
              <Select
                options={optionsWards}
                value={valueWard}
                onChange={changeHandlerWard}
                isDisabled={!valueDistrict}
                placeholder={"chọn phường xã"}
              />
            </div>
          </div>
          <Divider />
        </div>
      </Modal>
    </>
  );
}

export default AddAddressForm;
