import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { sygnet } from "../../srcAdmin/assets/brand/sygnet";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";

// sidebar nav config
import navigation from "../_nav";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <Link to="/">
            <motion.img
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.7, 0.8, 0.9, 1],
                scale: [1.4, 1.3, 1.2, 1],
              }}
              whileHover={{ scale: 1.4 }}
              transition={{ duration: 0.4 }}
              className="w-32 scale-105 h-auto ml-8 object-cover grow"
              src={logo}
              alt=""
            />
          </Link>
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          <CIcon
            customClassName="sidebar-brand-narrow"
            icon={sygnet}
            height={32}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: "set", sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
