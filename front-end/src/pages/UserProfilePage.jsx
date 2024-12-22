import {
  faArrowRightFromBracket,
  faCartShopping,
  faLockOpen,
  faNewspaper,
  faUser,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "antd";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, NavLink } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { fetchUserDetail } from "../redux/slices/userSlice";
const iconMap = {
  user: faUser,
  newspaper: faNewspaper,
  "lock-open": faLockOpen,
  "cart-shopping": faCartShopping,
  "arrow-right-from-bracket": faArrowRightFromBracket,
  admin: faUserShield,
};
const baseOptionProfile = [
  {
    icon: "user",
    title: "Thông tin tài khoản",
    path: "account-info",
  },
  {
    icon: "newspaper",
    title: "Sổ địa chỉ",
    path: "address-book",
  },
  {
    icon: "lock-open",
    title: "Đổi mật khẩu",
    path: "change-password",
  },
  {
    icon: "cart-shopping",
    title: "Đơn hàng",
    path: "orders",
  },
  {
    icon: "cart-shopping",
    title: "Lịch sử thử đồ",
    path: "model-try-on-history",
  },
  {
    icon: "arrow-right-from-bracket",
    title: "Đăng xuất",
    path: "logout",
  },
];

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const currentUsers = useSelector((state) => state.auth?.currentUser);
  const isAdmin = currentUsers?.roles?.some(
    (role) => role.name === "ROLE_ADMIN"
  );
  const optionProfile = useMemo(() => {
    const options = [...baseOptionProfile];
    if (isAdmin) {
      options.push({
        icon: "admin",
        title: "Admin",
        path: "/admin/dashboard",
      });
    }
    return options;
  }, [isAdmin]);

  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    dispatch(fetchUserDetail());
  }, [dispatch]);
  return (
    <div className="grid justify-center w-full grid-cols-1 gap-2 p-2 md:grid-cols-4">
      {/* left side */}
      <div className="flex flex-col w-full h-full col-span-1 p-4 bg-white">
        <div className="flex flex-col w-full text-center text-neutral-500">
          {/* <span className="font-semibold uppercase">
            {currentUsers?.username}
          </span> */}
          <span className="font-semibold uppercase">{`${
            currentUsers?.firstName || ""
          } ${currentUsers?.lastName || ""}`}</span>
          <span className="text-base">Email: {currentUsers?.email}</span>
        </div>
        <Divider />

        <div className="flex flex-col space-y-2">
          {optionProfile.map((item, index) => {
            if (item.path === "logout") {
              return (
                <div
                  key={index}
                  onClick={handleLogout}
                  className="p-2 text-black rounded-lg cursor-pointer hover:text-white hover:bg-blue-400 hover:font-semibold"
                >
                  <div className="flex flex-row items-center gap-4">
                    <FontAwesomeIcon icon={iconMap[item.icon]} />
                    <span>{item.title}</span>
                    <Link to={`/`}></Link>
                  </div>
                </div>
              );
            }
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive, isPending }) =>
                  isPending
                    ? "text-black hover:text-white hover:bg-blue-400 hover:font-semibold p-2 rounded-lg duration-300"
                    : isActive
                    ? " text-white bg-blue-400 font-semibold p-2 rounded-lg"
                    : "text-black hover:text-white hover:bg-blue-400 hover:font-semibold p-2 rounded-lg duration-300"
                }
              >
                <div className="flex flex-row items-center gap-4">
                  <FontAwesomeIcon icon={iconMap[item.icon]} />
                  <span>{item.title}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* right side */}
      <div className="w-full col-span-1 bg-white border-l md:col-span-3">
        <Outlet />
      </div>
    </div>
  );
}
