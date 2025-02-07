import { motion } from "framer-motion";
import { Badge, Divider, Dropdown, Menu } from "antd";
import { Link, NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { PiNotepadFill } from "react-icons/pi";
import { FaHeadphones, FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import {
    IoAppsSharp,
  IoLogOut,
  IoPersonAddSharp,
  IoPersonCircle,
  IoShirtSharp,
} from "react-icons/io5";

import logo from "../../assets/logo.jpg";
import useRedirectToLogin from "../../custom hooks/useRedirectToLogin";
import CategoryDropdown from "../CategoryDropdown";
import SearchBar from "../SearchBar";

import { logout } from "../../redux/slices/authSlice";
const { SubMenu } = Menu;

const menuCategories = (
  <Menu className="mt-3 bg-white">
    <SubMenu
      key="category"
      title={
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive
              ? "text-[#0F67B1] font-medium flex items-center"
              : "text-black hover:text-[#0F67B1] font-medium flex items-center"
          }
        >
          Danh mục sản phẩm
        </NavLink>
      }
      className="!text-2xl p-2 border-b border-b-gray-100"
    >
      <CategoryDropdown isbordered={false} />
    </SubMenu>
    <Menu.Item
      key="quality"
      className="p-2 text-2xl border-b border-b-gray-100"
    >
      Chất lượng sản phẩm
    </Menu.Item>
    <Menu.Item
      key="delivery"
      className="p-2 text-2xl border-b border-b-gray-100"
    >
      Phân phối sỉ toàn quốc
    </Menu.Item>
    <Menu.Item
      key="various"
      className="p-2 text-2xl border-b border-b-gray-100"
    >
      Mặt hàng đa dạng
    </Menu.Item>
    <Menu.Item key="super" className="p-2 text-2xl border-b border-b-gray-100">
      Giao hàng nhanh chóng
    </Menu.Item>
  </Menu>
);

function MenuLink({ Icon, title, to, dropdownContent }) {
  const linkContent = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-[#0F67B1] p-2 flex items-center gap-2 duration-200 font-medium"
          : "hover:text-[#0F67B1] p-2 flex items-center gap-2 text-black duration-200 font-medium"
      }
    >
      {Icon && <Icon className="text-[#0F67B1]" size={24} />}
      {title}
    </NavLink>
  );

  if (dropdownContent) {
    return (
      <>
        <Dropdown
          overlay={dropdownContent}
          placement="bottomLeft"
          trigger={["hover"]}
          disabled={location.pathname === "/"}
          className="flex gap-2"
        >
          {linkContent}
        </Dropdown>
        <Divider className="border-black/10 h-7" type="vertical" />
      </>
    );
  }

  return (
    <>
      {linkContent}
      <Divider className="border-black/10 h-7" type="vertical" />
    </>
  );
}

function NavigationLink({ Icon, title, to, count }) {
  const redirectToLogin = useRedirectToLogin();

  const handleClick = () => {
    redirectToLogin();
  };

  return (
    <>
      {title === "Đăng nhập" ? (
        <div
          className="flex flex-row items-center gap-1 text-xs cursor-pointer"
          onClick={handleClick}
        >
          <Icon size={24} className="text-white" />
          {title}
        </div>
      ) : (
        <Link className="flex flex-row items-center gap-1 text-xs" to={to}>
          {title === "Giỏ hàng" ? (
            <Badge count={count} size="small" showZero>
              <Icon size={22} className="text-white" />
            </Badge>
          ) : (
            <Icon size={22} className="text-white" />
          )}
          {title}
        </Link>
      )}
    </>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const number_of_product = useSelector(
    (state) => state.cart?.number_of_product
  );

  const menuItems = [
    {
      Icon: FaHome,
      title: "TRANG CHỦ",
      to: "/",
    },
    {
      Icon: IoAppsSharp,
      title: "THỂ LOẠI",
      to: "/",
      dropdownContent: menuCategories,
    },
    {
      Icon: IoShirtSharp,
      title: "SẢN PHẨM",
      to: "/products",
    },
    {
      Icon: FaHeadphones,
      title: "LIÊN HỆ",
      to: "/contact",
    },
  ];

  return (
    <div className="sticky top-0 flex-col items-center justify-start hidden w-full h-auto border-b border-b-slate-300 sm:flex z-[100]">
      {/* Top Bar */}
      <div className="flex items-center justify-center w-full p-2 text-white bg-[#3FA2F6]">
        <Link to="/">
          <motion.img
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.7, 0.8, 0.9, 1],
              scale: [1.4, 1.3, 1.2, 1],
            }}
            whileHover={{ scale: 1.4 }}
            transition={{ duration: 0.4 }}
            className="object-cover w-24 h-full grow"
            src={logo}
            alt=""
          />
        </Link>
        <SearchBar />
        <div className="items-center justify-end hidden w-full h-full gap-4 pt-1 lg:flex">
          <NavigationLink
            title="Kiểm tra đơn hàng"
            Icon={PiNotepadFill}
            to="/profile/orders"
          />
          <NavigationLink
            count={isAuthenticated ? number_of_product || 0 : 0}
            title="Giỏ hàng"
            Icon={FaShoppingCart}
            to="/cart"
          />
          {isAuthenticated && currentUser ? (
            <NavigationLink
              title={`Xin chào, ${currentUser?.username}`}
              Icon={FaUser}
              to="/profile"
            />
          ) : (
            <NavigationLink
              title="Đăng ký"
              Icon={IoPersonAddSharp}
              to="/register"
            />
          )}
          {isAuthenticated && currentUser ? (
            <Link
              className="flex flex-row items-center gap-2 text-sm"
              onClick={() => dispatch(logout())}
            >
              <IoLogOut size={26} />
              Đăng xuất
            </Link>
          ) : (
            <NavigationLink title="Đăng nhập" Icon={IoPersonCircle} />
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex items-center justify-center w-full px-2 py-2 bg-white">
        <div className="flex flex-row items-center justify-end">
          {menuItems.map((item, index) => (
            <MenuLink
              key={index}
              Icon={item.Icon}
              title={item.title}
              to={item.to}
              dropdownContent={item.dropdownContent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
