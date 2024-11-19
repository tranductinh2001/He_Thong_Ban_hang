import { FloatButton } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import _Breadcrumb from "../components/Breadcrumb";
import Loading from "../components/Loading";
import { lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { setActiveFilter } from "../redux/slices/productSlice";

const ProductList = lazy(() => import("../components/ProductList"));

const className =
  "py-3 duration-200 border-b-2 border-transparent hover:text-blue-500 hover:opacity-100 hover:font-semibold hover:border-blue-500";
const activeClassName =
  "text-blue-500 opacity-100 font-semibold duration-200 border-b-2 border-blue-500 py-3";

const FilterOption = [
  {
    title: "New",
    sort: "createdAt:1",
  },
  {
    title: "Sale",
    sort: "true",
  },
  {
    title: "Hot",
    sort: "true",
  },
  {
    title: "Giá Thấp",
    sort: "price:1",
  },
  {
    title: "Giá cao",
    sort: "price:2",
  },
];

export default function ProductPage() {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get("sort");
  const titleParam = searchParams.get("title");
  const search = searchParams.get("search");
  // console.log("aaa",sortParam + titleParam)
  const handleFilterChange = (item, index) => {
    //lưu id button
    dispatch(setActiveFilter({ title: titleParam, sort: sortParam }));
    setActiveButton(index);
    setSearchParams(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: window.innerHeight }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <_Breadcrumb title={"Sản phẩm"}></_Breadcrumb>
      <div className="sticky flex gap-5 text-xs border-b md:gap-10 sm:text-base">
        <span className="hidden py-3 ml-1 sm:block">Sắp xếp theo</span>
        {FilterOption.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => handleFilterChange(item, index)}
              className={`${
                activeButton === index ? `${activeClassName}` : `${className}`
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <Suspense fallback={<Loading />}>
        <ProductList
          sortParam={sortParam}
          titleParam={titleParam}
          searchParam={search}
        />
      </Suspense>
      <FloatButton.BackTop type="primary" />
    </motion.div>
  );
}
