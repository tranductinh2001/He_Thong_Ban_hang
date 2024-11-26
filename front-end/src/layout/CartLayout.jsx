import React from "react";
import { Outlet, Link } from "react-router-dom";
import Footer from "../components/Footer";
import logo from "../assets/logo.jpg";
import BottomNavigation from "../components/BottomNavigation";
import { Suspense } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import FloatMenuButton from "../components/FloatMenuButton";
import ResponsiveHeader from "../components/ResponsiveHeader";

export default function CartLayout() {
  return (
    <div>
      <Header />
      <ResponsiveHeader />
      <div className="min-h-screen">
        <Suspense fallback={<Loading />}>
          <div className="flex items-center justify-center w-full gap-5 py-2 text-white bg-gray-500 md:sticky top-24 z-[999]">
            <span>1 Giỏ Hàng</span>
            <span>2 Thanh toán</span>
            <span>3 Hoàn tất</span>
          </div>
          <div className="p-2">
            <Outlet />
          </div>
        </Suspense>
      </div>
      <BottomNavigation />
      <FloatMenuButton />
      <Footer />
    </div>
  );
}
