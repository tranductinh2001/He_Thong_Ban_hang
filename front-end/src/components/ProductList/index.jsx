import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductList,
  fetchProductListWithSearch,
  fetchProductListWithSortOrTitle,
  setActiveFilter,
  setActiveListProduct,
} from "../../redux/slices/productSlice";
import ProductCard from "../ProductCard/";

function ProductList({ sortParam, titleParam, searchParam }) {
  // console.log("ProductList -==========");

  const dispatch = useDispatch();
  const productListByPage = useSelector(
    (state) => state.products?.combinedProductList
  );
  const error = useSelector((state) => state.products?.error);
  const [hasMore, setHasMore] = useState(true);
  // const pageSize = useSelector((state) => state.products?.pageSize) || 3;
  const pageSize = 5;

  const totalProductItems = useSelector(
    (state) => state.products?.totalProductItems
  );
  const [currentPage, setCurrentPage] = useState(0);
 //console.log("productListByPage ", productListByPage);
  // Fetch products when filters or currentPage change
  useEffect(() => {
    setCurrentPage(1);
    dispatch(setActiveFilter({ title: titleParam, sort: sortParam }));
    dispatch(setActiveListProduct());
    getProductList(1);
  }, [sortParam, titleParam, searchParam]);

  useEffect(() => {
    // console.log("   product list     loading còn không nèF");
    if (productListByPage.length >= totalProductItems) {
      // console.log("  false  ");
      setHasMore(false);
    } else {
      // console.log("  true  ");
      setHasMore(true);
    }
  }, [totalProductItems, productListByPage.length]);

  const fetchMoreData = () => {
    dispatch(setActiveFilter({ title: titleParam, sort: sortParam }));
    if (productListByPage.length <= totalProductItems) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        getProductList(nextPage);
        return nextPage;
      });
      // console.log("crrent page ", currentPage)
    } else {
      setHasMore(false);
    }
  };

  const getProductList = (page) => {
    // console.log("Fetching product list for page", page);
    if (sortParam) {
      if (
        titleParam === "Hot" ||
        titleParam === "Sale" ||
        titleParam === "brand" ||
        titleParam === "category"
      ) {
        dispatch(
          fetchProductListWithSortOrTitle({
            sortParam,
            titleParam,
            currentPage: page,
            pageSize,
          })
        );
      } else {
        dispatch(
          fetchProductListWithSortOrTitle({
            sortParam,
            titleParam: "",
            currentPage: page,
            pageSize,
          })
        );
      }
    } else if (searchParam) {
      // console.log("fetchProductListWithSearch  -====");
      dispatch(
        fetchProductListWithSearch({
          searchParam,
          currentPage: page,
          pageSize,
        })
      );
    } else {
      // console.log("fetchProductList");
      dispatch(
        fetchProductList({
          sortParam: "",
          titleParam: "",
          searchParam: "",
          currentPage: page,
          pageSize,
        })
      );
    }
  };

  return (
    <div className="p-4 md:p-8 w-80%">
      {productListByPage.length === 0 ? (
        <p className="p-5 text-sm text-center">
          Không có sản phẩm nào trong danh sách.
        </p>
      ) : (
        <InfiniteScroll
          dataLength={productListByPage.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="flex items-center justify-center w-full">Loading...</div>}
          endMessage={
            <p className="p-5 text-sm text-center">
              Bạn đã xem hết danh sách sản phẩm
            </p>
          }
        >
          <div className="grid items-center justify-center w-full grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.isArray(productListByPage) &&
              productListByPage.map((product, index) => (
                <ProductCard
                  // key={product.id || index}
                  key={`${product?.id}-${index}`} // Kết hợp ID và index để đảm bảo key duy nhất
                  product={product}
                  displayQuantity={true}
                />
              ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

ProductList.propTypes = {
  sortParam: PropTypes.string,
  titleParam: PropTypes.string,
  searchParam: PropTypes.string,
};

export default React.memo(ProductList);
