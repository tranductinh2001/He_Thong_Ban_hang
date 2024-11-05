import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/admin/Header";
import _Menu from "../components/Menu";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import BottomNavigation from "../components/BottomNavigation";
import ResponsiveHeader from "../components/ResponsiveHeader";
import ChatBox from "../components/ChatBox";
import FloatMenuButton from "../components/FloatMenuButton";

// src/externalScripts.js
// import $ from './assets1/js/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import '/moment/min/moment.min.js';
import '../assets1/vendor/slimscroll/slimscroll.min.js';
import '../assets1/vendor/slimscroll/custom-scrollbar.js';
import '../assets1/vendor/daterange/daterange.js';
import '../assets1/vendor/daterange/custom-daterange.js';
import '../assets1/vendor/apex/apexcharts.min.js';
import '../assets1/vendor/rating/raty.js';
import '../assets1/vendor/rating/raty-custom.js';
import '../assets1/js/main.js';



export default function LayoutAdmin() {
  return (
    <div className="h-full w-full flex flex-col scroll-smooth">
      <Header />
      {/* <ResponsiveHeader /> */}
      <div className="p-2">
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
