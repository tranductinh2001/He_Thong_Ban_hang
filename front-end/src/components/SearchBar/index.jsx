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
  const [keyWordSearch, setKeyWordSearch] = useState(keyWord);
  const [keyWordSearchListProducts, setKeyWordSearchListProducts] =
    useState(keyWord);
  const productList = useSelector((state) => state.Search?.productListSearch);
  const loading = useSelector((state) => state.Search?.loading);
  const error = useSelector((state) => state.Search?.error);
  const pageSize = useSelector((state) => state.products?.pageSize) || 4;
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

  useEffect(() => {
    if (keyWordSearchListProducts) {
      dispatch(
        fetchProductList({
          sortParam: "",
          titleParam: "",
          keyWordSearchListProducts,
          currentPage: 1,
          pageSize,
        })
      );
    }
  }, [dispatch, keyWordSearchListProducts, pageSize]);

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
    return item?.images[0] ? item?.images[0] : placeholder;
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
    <div className="flex flex-row gap-10 flex-auto items-center justify-between">
      <div className="flex flex-col relative">
        <motion.div
          className="w-96 h-auto"
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
              className="absolute top-10 w-full z-50 bg-white rounded-lg border opacity-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-2 sticky top-0 bg-gray-100 z-10 w-full rounded-t-lg">
                Sản phẩm gợi ý
              </div>
              <div
                className="bg-white w-full border opacity-100 h-80 rounded-b-lg overflow-auto border-b last:border-b"
                id="scrollableDiv"
              >
                <InfiniteScroll
                  dataLength={productList.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<p>Loading...</p>}
                  endMessage={
                    <p className="text-center text-sm p-5">
                      Bạn đã xem hết danh sách sản phẩm
                    </p>
                  }
                  scrollableTarget="scrollableDiv" // Sử dụng id của div chứa để làm target cho scroll
                >
                  <List
                    className="bg-white p-3"
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
                                  className="w-20 h-20 rounded-full shadow-xl border-4 border-neutral-100"
                                />
                              }
                              title={<p>{item?.name}</p>}
                              description={
                                isAuthenticated ? (
                                  <p className="text-red-600 font-semibold">
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
