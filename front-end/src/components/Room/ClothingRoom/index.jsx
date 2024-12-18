import { Drawer, Button } from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Confetti from "react-confetti";
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
  const [isConfettiVisible, setConfettiVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (receivedData) {
      setIsLoading(true);
      const messageKey = Object.keys(receivedData)[0];
      const messageValue = receivedData[messageKey];
      setMessageSocket(messageValue);
      setIsLoading(false);
      setConfettiVisible(true);
    }
  }, [receivedData]);
  // console.log("selectedImage nè: ", imageList);

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    // Nếu ảnh đã được chọn, bỏ chọn
    if (selectedImage?.id === image?.id) {
      setSelectedImage(null);
    } else {
      // Nếu ảnh chưa được chọn, chọn ảnh
      setSelectedImage(image);
    }
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
            <div className="relative top-0 flex items-center justify-center flex-grow w-full md:sticky md:w-auto">
              {isLoading || isSubmitting ? (
                <div className="w-full flex justify-center items-center text-2xl h-[calc(100vh-200px)] bg-white bg-opacity-75 rounded-lg shadow-xl animate-pulse">
                  Đang tải...
                </div>
              ) : (
                <motion.div
                  className="max-w-full max-h-[calc(100vh-200px)] flex justify-center items-center rounded-lg shadow-xl border-4 border-gradient-to-r from-blue-500 to-pink-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  {isConfettiVisible && (
                    <Confetti
                      width={window.innerWidth}
                      height={window.innerHeight}
                      numberOfPieces={200}
                      recycle={false}
                    />
                  )}
                  <Image
                    className="object-contain h-full max-w-lg rounded-lg"
                    src={
                      MessageSocket ||
                      "https://cdn.sanity.io/images/hvisvj7q/production/26d2af036d7c08461ebde22c775230ee753880e1-1920x1080.jpg"
                    }
                    alt="Ảnh thử đồ"
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="w-1/4 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Thông tin người dùng</h3>
            <UserInfoForm
              setIsSubmitting={setIsSubmitting}
              selectedImages={selectedImages}
              productId={productId}
            />

            {/* </div> */}

            {/* } */}
            {/* <Carousel arrows infinite={false}>
              <div>
                <h3 style={contentStyle}>1</h3>
              </div>
              <div>
                <h3 style={contentStyle}>2</h3>
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
              <div>
                <h3 style={contentStyle}>4</h3>
              </div>
            </Carousel> */}
          </div>

          <div className="flex w-[300px] flex-wrap hover:cursor-pointer my-10 rounded-lg">
            <UserInfoForm selectedImage={selectedImage} productId={productId} />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

UserInfoForm.propTypes = {
  selectedImage: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
