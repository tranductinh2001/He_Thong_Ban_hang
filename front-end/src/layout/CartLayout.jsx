import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import Loading from "../components/Loading";
import FloatMenuButton from "../components/FloatMenuButton";
import ResponsiveHeader from "../components/ResponsiveHeader";

export default function CartLayout() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <ResponsiveHeader />

      <main className="flex-grow">
        <Suspense fallback={<Loading />}>
          <nav className="sticky z-50 text-white shadow-md top-16 bg-gradient-to-r from-[#3FA2F6] to-[#0F67B1]">
            <div className="container flex items-center justify-center px-4 py-3 mx-auto space-x-8 text-sm md:text-base">
              <span className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-2 font-bold text-blue-600 bg-white rounded-full">1</div>
                Giỏ Hàng
              </span>
              <span className="flex items-center opacity-70">
                <div className="flex items-center justify-center w-6 h-6 mr-2 font-bold text-blue-600 bg-white rounded-full">2</div>
                Thanh toán
              </span>
              <span className="flex items-center opacity-70">
                <div className="flex items-center justify-center w-6 h-6 mr-2 font-bold text-blue-600 bg-white rounded-full">3</div>
                Hoàn tất
              </span>
            </div>
          </nav>

          <div className="container px-4 py-6 mx-auto">
            <Outlet />
          </div>
        </Suspense>
      </main>

      <BottomNavigation />
      <FloatMenuButton />
      <Footer />
    </div>
  );
}
