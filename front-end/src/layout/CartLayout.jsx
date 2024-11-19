import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import BottomNavigation from "../components/BottomNavigation";
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
