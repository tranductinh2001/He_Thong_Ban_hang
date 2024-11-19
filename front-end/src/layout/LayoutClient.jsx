import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import _Menu from "../components/Menu";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import BottomNavigation from "../components/BottomNavigation";
import ResponsiveHeader from "../components/ResponsiveHeader";
import FloatMenuButton from "../components/FloatMenuButton";

export default function LayoutClient() {
  return (
    <div className="flex flex-col w-full h-full scroll-smooth">
      <Header />
      <ResponsiveHeader />
      <div className="min-h-screen p-2">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
      <BottomNavigation />
      {/* <ChatBox /> */}
      <FloatMenuButton />
      <Footer />
    </div>
  );
}
