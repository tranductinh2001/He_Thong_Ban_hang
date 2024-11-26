import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";
import CategoryDropdown from "../CategoryDropdown";

export default function _Menu() {
  const [isShowing, setIsShowing] = useState(false);
  const location = useLocation();

  const handleMouseEnter = () => {
    if (location.pathname === "/") {
      setIsShowing(false);
    } else {
      setIsShowing(true);
    }
  };

  const handleMouseLeave = () => {
    setIsShowing(false);
  };

  const menu = (
    <Menu>
      <Menu.Item className="w-56">
        <CategoryDropdown isbordered={false} />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="hidden sm:flex flex-row items-center justify-evenly gap-5 mt-5 sticky top-0 z-40 bg-white">
      <Dropdown
        dropdownRender={() => menu}
        placement="bottomLeft"
        disabled={location.pathname === "/"}
      >
        <NavLink
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          to="/categories"
          className="bg-blue-500 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          Danh mục sản phẩm
        </NavLink>
      </Dropdown>

      <NavLink
        to=""
        className="bg-blue-500 hover:bg-white hover:text-blue-400 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
        CHẤT LƯỢNG SẢN PHẨM
      </NavLink>
      <NavLink
        to=""
        className="bg-blue-500 hover:bg-white hover:text-blue-400 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
        PHÂN PHỐI SỈ TOÀN QUỐC
      </NavLink>
      <NavLink
        to=""
        className="bg-blue-500 hover:bg-white hover:text-blue-400 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
        MẶT HÀNG ĐA DẠNG
      </NavLink>
      <NavLink
        to="#"
        className="bg-blue-500 hover:bg-white hover:text-blue-400 text-white text-sm p-3 rounded-md flex flex-row gap-2 items-center"
      >
        <IoIosMenu size={20} className="text-black" />
        GIAO HÀNG NHANH CHÓNG
      </NavLink>
    </div>
  );
}
