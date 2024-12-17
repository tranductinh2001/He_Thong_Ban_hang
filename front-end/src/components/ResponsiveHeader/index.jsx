import { Drawer, Dropdown, Input, List } from "antd";
import React, { useEffect, useState } from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { RiArrowDownWideFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { logout } from "../../redux/slices/authSlice";
const { Search } = Input;

// Dropdown items
const DropDownItems = [
  {
    key: "1",
    label: <Link to="/products?title=brand&sort=nike">NIKE</Link>,
  },
  {
    key: "2",
    label: <Link to="products?title=brand&sort=adidas">ADIDAS</Link>,
  },
  {
    key: "3",
    label: (
      <Link to="products?title=category&sort=vợt cầu lông">VỢT CẦU LÔNG</Link>
    ),
  },
  {
    key: "4",
    label: (
      <Link to="products?title=category&sort=giày cầu lông">GIÀY CẦU LÔNG</Link>
    ),
  },
];

// List data
const ListData = [
  {
    title: "Trang chủ",
    to: "/",
  },
  {
    title: "Sản phẩm",
    to: "/products",
    children: DropDownItems,
  },
];

// Header Menu Content
const HeaderMenu = ({ username, onClose, logout }) => {
  const handleLogout = () => {
    logout();
    onClose();
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-lg font-light text-neutral-400">{username}</span>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row items-center gap-1">
          <CiUser size={20} />
          <Link
            to="profile"
            onClick={onClose}
            className="font-normal text-blue-600"
          >
            Thông tin
          </Link>
        </div>
        <div className="flex flex-row items-center gap-1">
          <CiLogout size={20} />
          <Link
            to="/"
            className="font-normal text-blue-600"
            onClick={handleLogout}
          >
            Đăng xuất
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ResponsiveHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const showMenuDrawer = () => {
    setMenuOpen(true);
  };

  const closeMenuDrawer = () => {
    setMenuOpen(false);
  };

  const showSearchDrawer = () => {
    setSearchOpen(true);
  };

  const closeSearchDrawer = () => {
    setSearchOpen(false);
  };
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);
  return (
    <div className="sticky top-0 z-50 flex flex-row items-center justify-between w-full h-auto pl-4 pr-4 text-white sm:hidden bg-[#0F67B1]">
      {/* MENU */}
      <div className="cursor-pointer" onClick={showMenuDrawer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      {/* LOGO */}
      <Link to="/">
        <img className="w-24" src={logo} alt="logo" />
      </Link>
      {/* SEARCH */}
      <div className="cursor-pointer" onClick={showSearchDrawer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      {/* Menu Drawer  */}
      <Drawer
        className=""
        title={
          isAuthenticated ? (
            <HeaderMenu
              username={currentUser.username}
              onClose={closeMenuDrawer}
              logout={() => {
                dispatch(logout());
              }}
            />
          ) : (
            <div className="flex flex-row items-center justify-center gap-5 text-blue-600 font-base">
              <Link to="login">Đăng nhập</Link>
              <Link to="register">Đăng ký</Link>
            </div>
          )
        }
        closeIcon
        placement="left"
        size="large"
        onClose={closeMenuDrawer}
        open={isMenuOpen}
      >
        <List
          size="small"
          dataSource={ListData}
          renderItem={(item) => (
            <List.Item className="text-lg">
              <Link to={item.to}>{item.title}</Link>
              {item.children && (
                <Dropdown
                  menu={{ items: item.children }}
                  trigger={["click"]}
                  arrow={{
                    pointAtCenter: true,
                  }}
                  overlayStyle={{
                    width: "360px",
                    overflow: "auto",
                  }}
                  placement="bottomLeft"
                >
                  <Link onClick={(e) => e.preventDefault()}>
                    <RiArrowDownWideFill />
                  </Link>
                </Dropdown>
              )}
            </List.Item>
          )}
        />
      </Drawer>
      {/* Search Drawer  */}
      <Drawer
        className=""
        title={
          <Search
            size="large"
            placeholder="Tìm kiếm..."
            //  onSearch={onSearch}
            enterButton
          />
        }
        closeIcon
        placement="right"
        size="large"
        onClose={closeSearchDrawer}
        open={isSearchOpen}
      ></Drawer>
    </div>
  );
}
