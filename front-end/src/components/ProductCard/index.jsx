import { Badge, Button } from "antd";
import { motion } from "framer-motion";
import { default as React, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/playholder.png";
import useSessionStorage from "../../custom hooks/useSessionStorage";
//thuộc tính displayQuantity = true : hiển thị số lượng tồn kho của sản phẩm

const ProductCard = React.memo(function ProductCard({
  product,
  displayQuantity,
}) {
  const [viewedProduct, setViewedProduct] = useSessionStorage(
    "viewedProducts",
    []
  );
  const addViewedProduct = () => {
    setViewedProduct(product);
    // console.log(viewedProduct);
    navigate(`/product/${product?.id}`);
  };

  const navigate = useNavigate();
  let isSale = product?.is_sale;
  let islogIN = useSelector((state) => state.auth.isAuthenticated);
  const imageUrl = product?.images[0] ? product?.images[0] : placeholder;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      // animate={{ opacity: 1, scale: 1, x: 1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true }}
      className="inline-flex flex-row items-start justify-center h-full gap-4 p-4 text-center duration-500 bg-white shadow-md hover:shadow-black rounded-xl ring-1 ring-gray-300 ring-opacity-50"
    >
      <div className="flex flex-col w-full gap-3 flex-basis-2/3 flex-grow-2">
        <div className="relative block w-full">
          <img
            id="img-product"
            src={
              product?.images?.length > 0
                ? product?.images[0]?.url
                : "/src/assets/default_image.png"
            }
            className={`w-full h-60 duration-500 shadow-neutral-500 transition-transform rounded-md object-contain object-center`}
            alt={product?.name}
          />

          {isSale && (
            // <img
            //   id="img-product "
            //   src={saletag}
            //   className="absolute bottom-0 right-0 w-16 h-16 transition-transform duration-1000"
            // />
            <Badge.Ribbon
              className="absolute duration-500 -top-10"
              text="Sale"
              color="red"
              placement="end"
            />
          )}
        </div>
        {/* Divider */}
        <div className="border-b"></div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-start gap-2">
            {product?.sizeList?.map((item, index) => (
              <span
                key={index}
                className="px-2 font-semibold text-left bg-gray-300 rounded-md w-fit"
              >
                {item.sizeName}
              </span>
            ))}
          </div>

          <div className="text-base text-left truncate w-52">
            {product?.name} - {product?.brand?.name.toUpperCase()}
          </div>

          <div>
            {islogIN ? (
              isSale ? (
                <div className="text-sm font-semibold text-left text-red-500">
                  <span className="text-red-500 line-through">Giá gốc:</span>{" "}
                  <span className="text-red-400 line-through">
                    {product?.price?.toLocaleString()}₫
                  </span>
                  {product?.is_sale && (
                    <span className="block text-sm font-semibold text-left">
                      {product?.sale_price?.toLocaleString()}₫
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-left">
                  <span className="text-left">
                    Giá gốc: {product?.price?.toLocaleString()}₫
                  </span>
                </div>
              )
            ) : (
              <p className="text-sm font-semibold text-left text-red-500">
                Đăng nhập để xem giá
              </p>
            )}
          </div>
        </div>
        {
          <div className="flex flex-row-reverse">
            <Button
              // to={`/product/${product?.id}`}
              onClick={addViewedProduct}
            >
              Xem chi tiết
            </Button>
          </div>
        }
      </div>
    </motion.div>
  );
});

export default ProductCard;

// {displayQuantity ? (
//     <div className="flex flex-col justify-between w-40 gap-2 text-center rounded-md h-50 flex-basis-1/3">
//       <div className="flex items-center justify-center h-full">
//         <span className="w-16 p-1 text-xs font-bold text-center text-white bg-red-500 rounded-sm">
//           kho
//         </span>
//       </div>
//       <div className="flex flex-col items-center justify-between h-full gap-5 text-center rounded-md">
//         <ul>
//           {product?.size_list && product?.size_list.length > 0 ? (
//             <div className="flex flex-col gap-8">
//               <div className="flex flex-col h-40 gap-2 overflow-y-auto">
//                 {product?.size_list?.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex flex-row items-center gap-5 text-left"
//                   >
//                     <span className="items-center flex-grow">
//                       {item.size_name}
//                     </span>
//                     {islogIN ? (
//                       item.quantity === 0 ? (
//                         <div className="px-2 text-right text-red-600">
//                           {item.quantity}
//                         </div>
//                       ) : (
//                         <span className="px-2 text-right text-green-600">
//                           {item.quantity}
//                         </span>
//                       )
//                     ) : (
//                       <div>
//                         <FaRegEyeSlash />
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </div>
//               {/* <Button size="small">Thêm giỏ hàng</Button> */}
//             </div>
//           ) : (
//             <div className="flex flex-col h-40 gap-2 overflow-y-auto">
//               {Object.entries(sizes).map(([size, quantity]) => (
//                 <li key={size} className="flex flex-row gap-5 text-left">
//                   <span className="flex-grow">{size}</span>
//                   {islogIN ? (
//                     quantity === 0 ? (
//                       <span className="px-2 text-right text-red-600 ">
//                         {quantity}
//                       </span>
//                     ) : (
//                       <span className="px-2 text-right text-green-600">
//                         {quantity}
//                       </span>
//                     )
//                   ) : (
//                     <FaRegEyeSlash />
//                   )}
//                 </li>
//               ))}
//             </div>
//           )}
//         </ul>
//         {islogIN ? (
//           ""
//         ) : (
//           // <Link to="/login">
//           <button
//             onClick={redirectToLogin}
//             className="p-1 px-2 text-xs text-white duration-500 bg-blue-400 border border-blue-400 rounded-full sm:text-sm hover:text-blue-400 hover:bg-white"
//           >
//             Đăng nhập
//           </button>
//           // </Link>
//         )}
//       </div>
//     </div>
//   ) : (
//     <></>
//   )}
