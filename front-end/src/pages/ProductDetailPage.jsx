import {
  Button,
  Carousel,
  Image,
  Input,
  InputNumber,
  message,
  Rate,
  Skeleton,
  Table,
} from "antd";
import _Breadcrumb from "../components/Breadcrumb";
import { motion } from "framer-motion";
import { default as React, useEffect, useState, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import ProductCard from "../components/ProductCard";
import { addManyToCart, fetchCartData } from "../redux/slices/cartSlice";
import useSessionStorage from "../custom hooks/useSessionStorage";
import {
  fetchProductDetail,
  fetchSaleProductList,
  setActiveProductDetail,
} from "../redux/slices/productSlice";
import PlaceHolderImage from "../assets/placeholder-image.jpg";
const { Search } = Input;

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
    <div className="flex flex-row gap-1 items-center justify-center">
      <InputNumber
        readOnly
        className="w-28 text-center"
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
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const product = useSelector((state) => state.products?.productDetails?.product);
  const saleProducts = useSelector((state) => state.products?.saleProductList);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const currentPageListSale = useSelector(
    (state) => state.products?.currentPage
  );
  //console.log("product   ",product);
  // console.log("SALE PRODUCTS");
  const [currentPage, setCurrentPage] = useState(1);
  const [allSaleProducts, setAllSaleProducts] = useState([]);
  const totalPageListSale = useSelector((state) => state.products?.totalPage);
  const loading = useSelector((state) => state.products?.loading);
  const dataSource = product?.sizeList?.map((item, index) => ({
    ...item,
    key: `${index}`,
    count: 0,
  }));
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  }, [dispatch, productId]);

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

  const handleBeforeChange = (current, next) => {
    // console.log(next, "----", saleProducts.length, "-----", current);
    if (
      next + 1 >= saleProducts.length &&
      currentPageListSale < totalPageListSale
    ) {
      setCurrentSlide(next);
      const newPage = currentPageListSale + 1;
      getProductListSale(newPage);
    }
  };

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
          <div className="flex flex-col sm:flex-row gap-5 justify-between">
            <motion.div
              className="flex sm:flex-row sm:justify-center flex-row-reverse justify-between flex-1 h-1/2"
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* <Image
                rootClassName="w-4/5"
                className="rounded-xl hidden sm:block"
                src={product?.images[0]}
                alt=""
                // fallback={PlaceHolderImage}
              />
              <Image
                className="rounded-xl sm:hidden"
                src={product?.images[0]}
                alt=""
              /> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-5 flex-1"
            >
              <span className="text-2xl font-semibold">{product?.name}</span>
              <span className="text-left text-orange-800 font-semibold">
                {/* {product?.brand?.toUpperCase()} */}
              </span>
              <div className="flex flex-row gap-1 items-center">
                <Rate defaultValue={0} />{" "}
                <span className="text-sm text-yellow-400">(0 đánh giá)</span>
              </div>
              <span className="text-red-500 font-semibold text-lg">
                {isAuthenticated ? (
                  product?.sale ? (
                    <div>
                      <span className="line-through">
                      {`Giá gốc: ${product?.price?.toLocaleString() || 'N/A'}đ`}
                      </span>
                      <br />
                      <span className="text-green-500">
                      {`Giá khuyến mãi: ${product?.salePrice?.toLocaleString() || 'N/A'}đ`}
                      </span>
                    </div>
                  ) : (
                    `Giá gốc: ${product?.price?.toLocaleString() || 'N/A'}đ`
                  )
                ) : (
                  "Đăng nhập để xem giá"
                )}
              </span>
              <span className="text-sm">
                Tình trạng:{" "}
                {product?.status ? (
                  <span className="rounded-full bg-green-300 text-green-700 px-2 p-1 text-xs">
                    Còn hàng
                  </span>
                ) : (
                  <span className="rounded-full bg-red-300 text-red-700 px-2 p-1 text-xs">
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
                  <div className="flex flex-row gap-2 w-full items-center justify-center bottom-20 z-40">
                    <Button
                      onClick={addToCart}
                      className="w-full"
                      type="primary"
                      danger
                      size="large"
                    >
                      <div className="flex flex-col">
                        <span>Thêm vào giỏ</span>
                        <span className="text-xs pb-1">
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
                        <span className="text-xs pb-1">Thanh toán ngay</span>
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
                  className="border-blue-600 border-2"
                  placeholder="Số điện thoại của bạn"
                />
                <Button type="primary">Gửi</Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
        <div className="flex flex-col gap-5 basis-2/3">
          <div className="mt-9 flex justify-center sm:block">
            <span className="font-semibold text-white text-lg bg-blue-400 p-2 px-3 rounded-full">
              Nội dung Chi Tiết
            </span>
          </div>
          <span className="border bg-gray-100 rounded-lg p-2">
            {product?.description}
          </span>
        </div>
        <div className=" flex flex-col shadow-xl rounded-lg sm:w-1/3 basis-1/3 h-96">
          <span className="bg-blue-500 text-white p-3 text-center rounded-t-lg">
            Sản phẩm đã xem
          </span>
          <div className=" flex flex-col overflow-auto gap-2 p-6">
            {viewedProducts.reverse().map((item, index) => (
              <Link key={item?._id || index} to={`/product/${item?.id}`}>
                <div
                  key={item?._id || index}
                  className="flex flex-row items-start gap-2"
                >
                  {/* <img className="w-20 h-auto" src={item?.images[0]} alt="" /> */}
                  <div className="flex flex-col">
                    <span className="text-slate-700">{item?.name}</span>
                    <span className="text-red-500 text-lg font-semibold">
                      {isAuthenticated
                        ? `Giá: ${item?.price?.toLocaleString() || 'N/A'}đ`
                        : "Đăng nhập để xem giá"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border-b shadow-xl bg-blue-500">
        <span className="text-lg font-semibold p-2 text-white">
          SẢN PHẨM SALE
        </span>
        <Carousel
          responsive={carouselResponsiveSetting}
          ref={carouselRef}
          // beforeChange={handleBeforeChange}
          className="w-full h-auto pb-3 bg-white"
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
            <div key={item._id || index} className="flex justify-center">
              <ProductCard key={item._id || index} product={item} />
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
