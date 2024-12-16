import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Drawer } from "antd";
import CartDrawer from "../../components/CartDrawer";
import { motion } from "framer-motion";
import { fetchCartData } from "../../redux/slices/cartSlice";
import {
  CiShoppingBasket,
  CiViewTable,
  CiUser,
  CiViewList,
  CiMenuBurger,
} from "react-icons/ci";
import useRedirectToLogin from "../../custom hooks/useRedirectToLogin";

const navLinks = [
  {
    Icon: CiMenuBurger,
    title: "Trang chủ",
    to: "/",
  },
  {
    Icon: CiViewTable,
    title: "Danh mục",
    to: "/categories",
  },
  {
    Icon: CiShoppingBasket,
    title: "Giỏ hàng",
    to: "",
    onClick: "showCartDrawer",
  },
  {
    Icon: CiViewList,
    title: "Đơn hàng",
    to: "/profile/orders",
  },
  {
    Icon: CiViewList,
    title: "Lịch sử thử đồ",
    to: "/profile/model-try-on-history",
  },
  {
    Icon: CiUser,
    title: "Tài khoản",
    to: "/profile",
  },
];

const NavigationLink = ({ Icon, title, to, count, onClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-2 cursor-pointer hover:text-blue-500"
      onClick={onClick}
    >
      {title === "Giỏ hàng" ? (
        <>
          <Badge showZero count={count ? count : 0}>
            <Icon size={25} />
          </Badge>
          <span className="text-xs text-center">{title}</span>
        </>
      ) : (
        <Link to={to} className="flex flex-col items-center justify-center">
          <Icon size={25} />
          <span className="text-xs text-center">{title}</span>
        </Link>
      )}
    </div>
  );
};

export default function BottomNavigation({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const number_of_product = useSelector(
    (state) => state.cart?.number_of_product
  );
  const [isCartDrawerOpen, setCartDrawOpen] = useState(false);
  const products = useSelector((state) => state.cart?.products);
  const redirectToLogin = useRedirectToLogin();
  const showCartDrawer = () => {
    setCartDrawOpen(true);
  };
  const closeCartDrawer = () => {
    setCartDrawOpen(false);
  };

  const handleProtectedAction = (to) => {
    // Kiểm tra nếu người dùng chưa đăng nhập //
    if (!currentUser) {
      redirectToLogin();
    } else {
      navigate(to);
    }
  };
  // useEffect(() => {
  //   if (currentUser) dispatch(fetchCartData(currentUser?.id));
  // }, [dispatch, currentUser]);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-row justify-between gap-2 p-1 overflow-hidden bg-white border-t border-black sm:hidden">
      {navLinks.map((item, index) => {
        return (
          <NavigationLink
            key={index}
            Icon={item.Icon}
            title={item.title}
            to={item.to}
            count={number_of_product ? number_of_product : 0}
            onClick={
              item.title === "Giỏ hàng"
                ? showCartDrawer
                : item.title === "Tài khoản"
                ? () => handleProtectedAction(item.to)
                : undefined
            }
          />
        );
      })}
      <CartDrawer
        open={isCartDrawerOpen}
        onClose={closeCartDrawer}
        size={"large"}
      />
    </div>
  );
}
