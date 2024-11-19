import _Carousel from "../components/Carousel";
import AdsCard from "../components/AdsCard";
import homeImage1 from "../assets/home-image1.jpg";
import homeImage2 from "../assets/home-image2.png";
import { CiMedal } from "react-icons/ci";
import CategoryDropdown from "../components/CategoryDropdown";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { motion } from "framer-motion";

const adsList = [
  {
    icon: CiMedal,
    to: "#",
    title: "CHIẾT KHẤU SỈ HẤP DẪN",
    description:
      "Lấy hàng sỉ tại kawin.vn bạn sẽ được áp dụng mức chiết khấu hấp dẫn.",
  },
  {
    icon: CiMedal,
    title: "GIÁ CẢ CẠNH TRANH",
    to: "#",
    description:
      "Giá sỉ tốt nhất đối với các mặt hàng thể thao đang kinh doanh.",
  },
  {
    icon: CiMedal,
    title: "HÀNG HÓA ĐA DẠNG, SẴN KHO",
    to: "#",
    description: "Bạn có thể xem tồn kho và đặt hàng tiện lợi.",
  },
  {
    icon: CiMedal,
    title: "HÀNG GIAO NHANH CHÓNG",
    to: "#",
    description: "Tất cả đơn hàng được xử lý ngay sau khi khách đặt hàng.",
  },
];

export default function HomePage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <motion.div
      initial={{ opacity: 0, x: -window.innerHeight }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid items-start justify-center grid-cols-1 gap-2 md:grid-cols-8">
        <div className="flex flex-col order-1 w-full col-span-1 gap-2 md:col-span-2 md:order-2">
          <CategoryDropdown isbordered={true} className="hidden md:block" />
          <img src={homeImage1} alt="" className="h-full rounded-lg" />
        </div>

        <div className="flex flex-col items-center justify-around order-2 w-full h-full col-span-1 md:col-span-4 md:order-1">
          <div className="flex flex-col items-center justify-center">
            <span className="text-red-500">Quần áo thể thao KAWIN</span>
            <span className="text-2xl font-semibold text-center text-neutral-700">
              Chào mừng quý khách đã đến trang đặt hàng.
            </span>
          </div>
          <_Carousel />
        </div>

        <div className="order-3 w-full h-full col-span-1 md:col-span-2">
          <img
            src={homeImage2}
            alt=""
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-between w-full gap-3 mt-5 sm:flex-row sm:items-stretch">
        {adsList.map((item, index) => (
          <AdsCard
            key={index}
            Icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>

      {!isAuthenticated ? (
        <div className="my-2">
          <div className="flex flex-col items-center gap-5 p-10 bg-gradient-to-r from-red-500 to-slate-400">
            <span className="text-3xl text-center text-white drop-shadow-lg">
              Đăng ký, đăng nhập để mua hàng sỉ
            </span>
            <div className="flex gap-5">
              <Link to="login">
                <Button type="primary" size={"large"}>
                  Đăng nhập
                </Button>
              </Link>
              <Link to="register">
                <Button type="primary" danger size={"large"}>
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </motion.div>
  );
}
