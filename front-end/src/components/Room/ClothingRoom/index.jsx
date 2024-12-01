import { Drawer, Button } from "antd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserInfoForm from "../UserInfoForm";
import imagBackgroundRoom from "../../../assets/room/room.jpg";
import { Carousel, Image } from "antd";
import { useWebSocket } from "../../../WebSocket/WebSocketContext";

export default function ClothingRoom({ imageList }) {
  const { receivedData } = useWebSocket();
  const [MessageSocket, setMessageSocket] = useState("");
  // console.log("MessageSocket   ", MessageSocket);
  useEffect(() => {
    if (receivedData) {
      // Tách dữ liệu từ đối tượng
      const messageKey = Object.keys(receivedData)[0]; // Lấy key đầu tiên
      const messageValue = receivedData[messageKey]; // Lấy giá trị tương ứng
      setMessageSocket(messageValue);
      console.log("data url nè: ", MessageSocket);
    }
  }, [receivedData]);
  // console.log("selectedImage nè: ", imageList);

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageSelect = (image) => {
    if (selectedImages.some((selectedImage) => selectedImage.id === image.id)) {
      // Nếu ảnh đã được chọn, bỏ chọn
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter(
          (selectedImage) => selectedImage.id !== image.id
        )
      );
    } else {
      // Nếu ảnh chưa được chọn, chọn ảnh
      setSelectedImages((prevSelectedImages) => [...prevSelectedImages, image]);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div className="bg-cover bg-center flex flex-col">
      <Button type="primary" onClick={showDrawer}>
        Mở
      </Button>
      <Drawer
        title="Clothing Drawer"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        width={1500}
        bodyStyle={{
          backgroundImage: `url(${imagBackgroundRoom})`,
          // background: MessageSocket,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100%",
        }}
      >
        <div className="flex item-center justify-between my-10">
          <div className="flex flex-col flex-wrap hover:cursor-pointer rounded-lg">
            {imageList?.map((image) => (
              <div
                key={image.id}
                className={`flex flex-col items-center p-2 cursor-pointer rounded-lg ${
                  selectedImages.some(
                    (selectedImage) => selectedImage.id === image.id
                  )
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <img
                  className="w-[150px] h-[150px] rounded-lg"
                  src={image.url}
                  alt={image.name}
                />
                <span className="text-sm mt-2">{image.name}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col item-center justify-center ">
            {/* {product.images.map((image, index) => ( */}
            {/* <div className=""> */}
            <Image
              style={{ width: "600px", height: "600px" }}
              src={MessageSocket}
              alt="Ảnh thử đồ"
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
            <UserInfoForm selectedImages={selectedImages} />
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
};
