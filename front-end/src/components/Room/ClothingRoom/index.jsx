import { Drawer, Button } from "antd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserInfoForm from "../UserInfoForm";
import imagBackgroundRoom from "../../../assets/room/room.jpg";
import { Image } from "antd";
import { useWebSocket } from "../../../WebSocket/WebSocketContext";
import { CloseOutlined } from "@ant-design/icons";

export default function ClothingRoom({ imageList, productId }) {
  const { receivedData } = useWebSocket();
  const [MessageSocket, setMessageSocket] = useState("");
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (receivedData) {
      setIsLoading(true);
      const messageKey = Object.keys(receivedData)[0];
      const messageValue = receivedData[messageKey];
      setMessageSocket(messageValue);
      setIsLoading(false);
    }
  }, [receivedData]);

  const handleImageSelect = (image) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.some((selectedImage) => selectedImage.id === image.id)
        ? prevSelectedImages.filter(
            (selectedImage) => selectedImage.id !== image.id
          )
        : [...prevSelectedImages, image]
    );
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <div className="flex flex-col">
      <Button type="primary" onClick={showDrawer} className="self-start">
        Mở phòng thử đồ
      </Button>
      <Drawer
        title={
          <div className="flex items-center">
            <CloseOutlined
              className="mr-2 text-lg transition-colors cursor-pointer hover:text-blue-500"
              onClick={onClose}
            />
            <span>Phòng thử đồ</span>
          </div>
        }
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        width={1500}
        bodyStyle={{
          backgroundImage: `url(${imagBackgroundRoom})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100%",
        }}
      >
        <div className="flex flex-col items-start justify-between h-full space-x-4 md:flex-row">
          <div className="relative top-0 md:sticky w-1/4 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-200px)]">
            <h3 className="mb-4 text-lg font-semibold">Chọn trang phục</h3>
            <div className="grid grid-cols-2 gap-4">
              {imageList?.map((image) => (
                <div
                  key={image.id}
                  className={`flex flex-col items-center p-2 cursor-pointer rounded-lg transition-all duration-300 ${
                    selectedImages.some(
                      (selectedImage) => selectedImage.id === image.id
                    )
                      ? "border-2 border-blue-500 bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    className="object-cover w-full h-32 rounded-lg"
                    src={image.url}
                    alt={image.name}
                  />
                  <span className="mt-2 text-sm text-center">{image.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative top-0 flex items-center justify-center flex-grow w-full md:sticky md:w-auto">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <Image
                className="max-w-full max-h-[calc(100vh-200px)] object-contain rounded-lg shadow-xl"
                src={MessageSocket || "placeholder-image-url.jpg"}
                alt="Ảnh thử đồ"
              />
            )}
          </div>

          <div className="w-1/4 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Thông tin người dùng</h3>
            <UserInfoForm
              selectedImages={selectedImages}
              productId={productId}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

ClothingRoom.propTypes = {
  imageList: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  productId: PropTypes.any.isRequired,
};
