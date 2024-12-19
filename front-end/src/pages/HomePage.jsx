import React, { useEffect, lazy, Suspense } from "react";
import _Carousel from "../components/Carousel";
import AdsCard from "../components/AdsCard";
import homeImage1 from "../assets/home-image1.jpg";
import homeImage2 from "../assets/home-image2.png";
import { CiMedal } from "react-icons/ci";
import CategoryDropdown from "../components/CategoryDropdown";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { fetchProductListAll } from "../redux/slices/productSlice";
import { useState } from "react";
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
  const productListAll = useSelector((state) => state.products?.productListAll);
  const [latestProducts, setLatestProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductListAll());
  }, [dispatch]);
  console.log("productListAll  ", productListAll);

  useEffect(() => {
    if (productListAll?.length > 0) {
      // Sắp xếp danh sách theo ngày tạo mới nhất
      const sortedProducts = [...productListAll].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // Lấy 10 sản phẩm đầu tiên
      setLatestProducts(sortedProducts.slice(0, 10));
    }
  }, [productListAll]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -window.innerHeight }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-2xl font-bold text-center uppercase md:text-4xl text-neutral-700">
          Chào mừng quý khách đã đến trang đặt hàng.
        </h1>
      </div>

      <div className="grid items-start justify-center grid-cols-1 gap-2 md:grid-cols-8">
        <div className="flex flex-col order-1 w-full col-span-1 gap-2 md:col-span-2 md:order-2">
          <CategoryDropdown isbordered={true} className="hidden md:block" />
          <img src={homeImage1} alt="" className="h-full rounded-lg" />
        </div>

        <div className="flex flex-col items-center justify-around order-2 w-full h-full col-span-1 md:col-span-4 md:order-1">
          <_Carousel />
        </div>

        <div className="order-3 w-full h-full col-span-1 md:col-span-2">
          <img src={homeImage2} alt="" className="w-full h-full rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-6 my-10">
  <h1 className="text-xl md:text-3xl text-center">Sản phẩm mới nhất</h1>
  <div className="flex flex-row flex-wrap items-center justify-center gap-6 w-full">
    {Array.isArray(latestProducts) &&
      latestProducts
        .slice(0, 6)
        .map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            displayQuantity={true}
          />
        ))}
  </div>
</div>


      <div className="flex flex-col items-start justify-start w-full gap-4 my-10">
        <div className="flex flex-col items-center justify-between w-full gap-3 sm:flex-row sm:items-stretch">
          {adsList?.map((item, index) => (
            <AdsCard
              key={index}
              Icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
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
