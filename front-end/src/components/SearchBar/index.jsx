import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Divider, Input, List } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import placeholder from "../../assets/playholder.png";
import { fetchProductList } from "../../redux/slices/productSlice";
import { fetchFiveProduct } from "../../redux/slices/searchSlice";
import { useDebounce } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { setActiveResetProductList } from "../../redux/slices/searchSlice";
const { Search } = Input;

export default function SearchBar({ keyWord }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [keyWordSearch, setKeyWordSearch] = useState("");
  const [keyWordSearchListProducts, setKeyWordSearchListProducts] =
    useState("");
  const productList = useSelector((state) => state.Search?.productListSearch);
  const loading = useSelector((state) => state.Search?.loading);
  const error = useSelector((state) => state.Search?.error);
  const pageSize = useSelector((state) => state.Search?.pageSize) || 4;
  const useDebounceSearchTerm = useDebounce(keyWordSearch, 300);

  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalProductItems = useSelector(
    (state) => state.Search?.totalProductItems
  );

  const handleSearch = (value) => {
    setIsOpenDropDown(true);
    setKeyWordSearchListProducts(value);
    navigate(`/products?search=${value}`);
  };

  // useEffect(() => {
  //   if (keyWordSearchListProducts) {
  //     dispatch(
  //       fetchProductList({
  //         sortParam: "",
  //         titleParam: "",
  //         keyWordSearchListProducts,
  //         currentPage: 1,
  //         pageSize,
  //       })
  //     );
  //   }
  // }, [dispatch, keyWordSearchListProducts, pageSize]);

  const hamdleOnChange = (value) => {
    setIsOpenDropDown(true);
    setKeyWordSearch(value);
  };

  const handleInputFocus = () => {
    setIsOpenDropDown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpenDropDown(false);
    }, 300);
  };

  useEffect(() => {
    if (useDebounceSearchTerm) {
      dispatch(setActiveResetProductList());
      setCurrentPage(1);
      dispatch(
        fetchFiveProduct({ keyWord: useDebounceSearchTerm, currentPage: 1 })
      );
    }
  }, [dispatch, useDebounceSearchTerm]);

  const getProductListSearchByCurrentPage = (page) => {
    dispatch(
      fetchFiveProduct({ keyWord: useDebounceSearchTerm, currentPage: page })
    );
  };

  const urlImg = (item) => {
    return item?.images[0] ? item?.images[0]?.url : placeholder;
  };

  const fetchMoreData = () => {
    if (productList.length < totalProductItems) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        getProductListSearchByCurrentPage(nextPage);
        return nextPage;
      });
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (productList.length >= totalProductItems) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalProductItems, productList.length]);

  return (
    <div className="flex flex-row items-center justify-between flex-auto gap-10">
      <div className="relative flex flex-col">
        <motion.div
          className="h-auto w-96"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Search
            placeholder="Nhập sản phẩm tìm kiếm"
            enterButton
            onSearch={handleSearch}
            onChange={(e) => hamdleOnChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={keyWordSearch}
          />
        </motion.div>
        <AnimatePresence>
          {isOpenDropDown && keyWordSearch && (
            <motion.div
              className="absolute z-50 w-full bg-white border rounded-lg opacity-100 top-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sticky top-0 z-10 w-full p-2 bg-gray-500 rounded-t-lg">
                Sản phẩm gợi ý
              </div>
              <div
                className="w-full overflow-auto bg-white border border-b rounded-b-lg opacity-100 h-80 last:border-b"
                id="scrollableDiv"
              >
                <InfiniteScroll
                  dataLength={productList.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<p>Loading...</p>}
                  endMessage={
                    <p className="p-5 text-sm text-center">
                      Bạn đã xem hết danh sách sản phẩm
                    </p>
                  }
                  scrollableTarget="scrollableDiv" // Sử dụng id của div chứa để làm target cho scroll
                >
                  <List
                    className="p-3 bg-white"
                    itemLayout="vertical"
                    dataSource={productList}
                    split={true}
                    renderItem={(item, index) => (
                      <Link
                        to={`/product/${item?._id}`}
                        key={item?._id}
                        onClick={handleInputBlur}
                      >
                        <motion.div
                          className="w-full border-b border-gray-300 last:border-b-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={urlImg(item)}
                                  className="w-20 h-20 border-4 rounded-full shadow-xl border-neutral-100"
                                />
                              }
                              title={<p>{item?.name}</p>}
                              description={
                                isAuthenticated ? (
                                  <p className="font-semibold text-red-600">
                                    {item?.price?.toLocaleString()}₫
                                  </p>
                                ) : (
                                  <p className="font-semibold">
                                    Đăng nhập để xem giá
                                  </p>
                                )
                              }
                            />
                            <Divider />
                          </List.Item>
                        </motion.div>
                      </Link>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
