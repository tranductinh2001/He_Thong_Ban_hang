import {
  Button,
  Carousel,
  Image,
  Input,
  InputNumber,
  message,
  Table,
} from "antd";
import CommentList from "../components/commentsData";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import ProductCard from "../components/ProductCard";
import { addManyToCart } from "../redux/slices/cartSlice";
import useSessionStorage from "../custom hooks/useSessionStorage";
import {
  fetchProductDetail,
  fetchSaleProductList,
} from "../redux/slices/productSlice";

import ClothingRoom from "../components/Room/ClothingRoom";
import RatingModal from "../components/RateModal/RateModal";
import { fetchSizesByProductId } from "../redux/slices/sizeSlice";
const carouselResponsiveSetting = [
  {
    breakpoint: 640,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      dots: false,
    },
  },
];

const QuantityEditor = ({ max, min, onChange }) => {
  const [value, setValue] = useState(0);

  const handleIncrease = () => {
    if (value < max) {
      setValue(value + 1);
      onChange(value + 1);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      setValue(value - 1);
      onChange(value - 1);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-1">
      <InputNumber
        readOnly
        className="text-center w-28"
        min={min}
        max={max}
        value={value}
        onChange={(val) => {
          setValue(val);
          onChange(val);
        }}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<FaPlus />}
        onClick={handleIncrease}
        disabled={value >= max}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<FaMinus />}
        onClick={handleDecrease}
        disabled={value <= min}
      />
    </div>
  );
};

function CustomArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#3498db",
        borderRadius: "10px",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
}

const ProductDetailPage = () => {
  const { productId } = useParams();

  const [viewedProducts, setViewedProducts] = useSessionStorage(
    "viewedProducts",
    []
  );

  const dispatch = useDispatch();
  const product = useSelector(
    (state) => state.products?.productDetails?.product
  );
  const sizeByProduct = useSelector((state) => state.size?.sizeListByIdProduct);
  const saleProducts = useSelector((state) => state.products?.saleProductList);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const loading = useSelector((state) => state.products?.loading);
  const dataSource = sizeByProduct?.map((item, index) => ({
    ...item,
    key: `${index}`,
    count: 0,
  }));

  // console.log("sizeByProduct   ", sizeByProduct);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product?.images[0]?.url ?? "/src/assets/default_image.png"
  );

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Bạn chưa chọn sản phẩm!",
    });
  };

  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    dispatch(fetchProductDetail(productId));
    dispatch(fetchSizesByProductId(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]?.url);
      // console.log("Updated selectedImage:", product.images[0]?.url);
    }
  }, [product]);

  //check viewed product
  useEffect(() => {
    if (product) {
      setViewedProducts((prevViewedProducts) => {
        const isProductViewed = prevViewedProducts.some(
          (p) => p?.id === product?.id
        );
        if (!isProductViewed) {
          return [...prevViewedProducts, product];
        }

        return prevViewedProducts;
      });
    }
  }, [product]);

  const handleQuantityChange = (RowItem, newCount) => {
    const key = RowItem.key;
    // console.log("rowitem   ", RowItem.sizeName);
    const existingItem = cart.find((item) => item.key === key);

    if (existingItem) {
      const updatedCart = cart
        .map((item) =>
          item.key === key
            ? {
                ...item,
                product: product,
                count: newCount,
                size: RowItem.sizeName,
              }
            : item
        )
        .filter((item) => item.count > 0);
      setCart(updatedCart);
    } else {
      const newItem = {
        key,
        count: newCount,
        product: product,
        size: RowItem.sizeName,
      };
      const updatedCart = [...cart, newItem].filter((item) => item.count > 0);
      setCart(updatedCart);
    }
  };

  const addToCart = () => {
    if (cart && cart?.length > 0) {
      // console.log("cart   ", cart);
      dispatch(addManyToCart({ products: cart }));
      // dispatch(fetchCartData());
      showDrawer();
      // dispatch(fetchCartData());

      // console.log("cart: ", cart);
    } else {
      error();
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      width: 120,
      dataIndex: "sizeName",
      align: "center",
      key: "size",
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      width: 150,
      align: "center",
      key: "quantity",
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      width: 150,
      align: "center",
      key: "count",
      render: (text, record) => (
        <QuantityEditor
          min={0}
          max={record.quantity}
          value={record.count}
          onChange={(newCount) => handleQuantityChange(record, newCount)}
        />
      ),
    },
  ];

  const getProductListSale = (page) => {
    dispatch(
      fetchSaleProductList({
        currentPage: page,
        pageSize: 5,
      })
    );
  };

  useEffect(() => {
    const loadInitialProducts = async () => {
      getProductListSale(1);
    };
    loadInitialProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0.2, scale: 0.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-10"
    >
      {contextHolder}
      {!loading && !product ? (
        <div>Không có sản phẩm này!</div>
      ) : (
        <>
          <div className="flex flex-col justify-between sm:flex-row">
            <motion.div
              className="relative flex flex-col items-center flex-1 w-full h-full sm:flex-row sm:justify-center"
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hình ảnh lớn */}
              <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden flex items-center justify-center">
                <Image
                  className="object-contain w-full h-full sm:max-h-[700px] md:max-h-[800px] xl:max-h-[900px] max-w-full rounded-xl"
                  src={selectedImage}
                  alt={product?.name || "Product Image"}
                />
              </div>

              {/* Thumbnail hình ảnh nhỏ */}
              {product?.images?.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex sm:flex-col sm:flex-wrap gap-2 sm:w-auto sm:justify-center">
                  {product?.images?.map((image, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl border border-gray-200 overflow-hidden cursor-pointer"
                      onClick={() => handleImageClick(image?.url)}
                    >
                      <Image
                        className="w-full h-full object-cover"
                        src={image?.url}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col flex-1 w-full gap-2 mt-24 md:mt-0"
            >
              <div className="flex items-center justify-start gap-4">
                <span className="text-2xl font-semibold">
                  {product?.name} - {product?.brand?.name.toUpperCase()}
                </span>
                <ClothingRoom
                  imageList={product?.images || []}
                  productId={product?.id || 0}
                />
              </div>
              <RatingModal productId={productId} />
              <span className="text-lg font-semibold text-red-500">
                {isAuthenticated ? (
                  product?.sale ? (
                    <div>
                      <span className="line-through">
                        {`Giá gốc: ${
                          product?.price?.toLocaleString() || "N/A"
                        }đ`}
                      </span>
                      <br />
                      <span className="text-green-500">
                        {`Giá khuyến mãi: ${
                          product?.salePrice?.toLocaleString() || "N/A"
                        }đ`}
                      </span>
                    </div>
                  ) : (
                    `Giá gốc: ${product?.price?.toLocaleString() || "N/A"}đ`
                  )
                ) : (
                  "Đăng nhập để xem giá"
                )}
              </span>
              <span className="text-sm">
                Tình trạng:{" "}
                {product?.status ? (
                  <span className="p-1 px-2 text-xs text-green-700 bg-green-300 rounded-full">
                    Còn hàng
                  </span>
                ) : (
                  <span className="p-1 px-2 text-xs text-red-700 bg-red-300 rounded-full">
                    Hết hàng
                  </span>
                )}
              </span>
              {isAuthenticated && (
                <>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                  />
                  <div className="z-40 flex flex-row items-center justify-center w-full gap-2 bottom-20">
                    <Button
                      onClick={addToCart}
                      className="w-full !border-2 !border-blue-500 !p-5 !bg-blue-300"
                    >
                      <div className="flex flex-col text-black">
                        <span>Thêm vào giỏ</span>
                        <span className="pb-1 text-xs">
                          và mua sản phẩm khác
                        </span>
                      </div>
                    </Button>
                    {/* <Button
                      className="w-full"
                      type="primary"
                      danger
                      size="large"
                    >
                      <div className="flex flex-col">
                        <span>Đặt ngay</span>
                        <span className="pb-1 text-xs">Thanh toán ngay</span>
                      </div>
                    </Button> */}
                  </div>
                </>
              )}
              <span className="text-sm font-medium">
                Quý khách vui lòng để lại số điện thoại để được tư vấn sỉ
              </span>
              <div className="flex flex-row items-center gap-1">
                <Input
                  className="border-2 border-blue-500"
                  placeholder="Số điện thoại của bạn"
                />
                <Button type="primary">Gửi</Button>
              </div>
            </motion.div>
          </div>
        </>
      )}

      <div className="flex flex-col justify-between w-full gap-5 sm:flex-row">
        <div className="flex flex-col basis-2/3">
          <div className="flex justify-start w-full p-3 bg-[#0F67B1] rounded-t-lg sm:block">
            <span className="text-lg font-semibold text-white">
              Nội dung Chi Tiết
            </span>
          </div>

          <span className="p-2 bg-white">{product?.description}</span>
        </div>
        <div className="flex flex-col rounded-lg shadow-lg sm:w-1/3 basis-1/3">
          <span className="p-3 text-center text-white bg-[#0F67B1] rounded-t-lg">
            Sản phẩm đã xem
          </span>
          <div className="flex flex-col gap-2 p-6 overflow-auto bg-white">
            {viewedProducts.reverse().map((item, index) => (
              <Link key={item?.id || index} to={`/product/${item?.id}`}>
                <div
                  key={item?.id || index}
                  className="flex flex-row items-start gap-2"
                >
                  {/* <img className="w-20 h-auto" src={item?.images[0]} alt="" /> */}
                  <div className="flex flex-col">
                    <span className="text-slate-700">{item?.name}</span>
                    <span className="text-base font-semibold text-red-500">
                      {isAuthenticated
                        ? `Giá: ${item?.price?.toLocaleString() || "N/A"}đ`
                        : "Đăng nhập để xem giá"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-[#0F67B1] rounded-lg shadow-lg w-full">
        <span className="p-4 text-lg font-semibold text-white border-b border-blue-300">
          Bình luận của sản phẩm
        </span>
        <div className="p-6 bg-white rounded-b-lg">
          {/* Thêm class Tailwind để chỉnh sửa nội dung */}
          <CommentList className="w-full" />
        </div>
      </div>

      <div className="flex flex-col bg-[#0F67B1] rounded-lg">
        <span className="p-2 text-lg font-semibold text-white">
          SẢN PHẨM SALE
        </span>
        <Carousel
          responsive={carouselResponsiveSetting}
          ref={carouselRef}
          // beforeChange={handleBeforeChange}
          className="w-full h-auto p-2 bg-white"
          autoplay
          arrows
          infinite={true}
          speed={1000}
          dots={false}
          slidesToShow={4}
          slidesToScroll={1}
          nextArrow={<CustomArrow />}
          prevArrow={<CustomArrow />}
          initialSlide={currentSlide}
        >
          {saleProducts.map((item, index) => (
            <div key={item.id || index} className="flex justify-center py-4">
              <ProductCard key={item.id || index} product={item} />
            </div>
          ))}
        </Carousel>
      </div>
      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
    </motion.div>
  );
};
ProductDetailPage.displayName = "ProductDetailPage";
export default ProductDetailPage;
