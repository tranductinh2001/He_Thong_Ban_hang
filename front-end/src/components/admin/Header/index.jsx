import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg"; // Giả định bạn có logo

const Header = () => {
  return (
    <>
      {/* Meta Tags */}
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Admin Templates & Dashboard UI Kits" />
        <meta name="author" content="Bootstrap Gallery" />
        <link rel="canonical" href="https://www.bootstrap.gallery/" />
        <meta property="og:url" content="https://www.bootstrap.gallery" />
        <meta property="og:title" content="Admin Templates - Dashboard Templates | Bootstrap Gallery" />
        <meta property="og:description" content="Marketplace for Bootstrap Admin Dashboards" />
        <meta property="og:type" content="Website" />
        <meta property="og:site_name" content="Bootstrap Gallery" />
        <link rel="shortcut icon" href="/assets1/img/favicon.svg" />
        
        {/* CSS Files */}
        <link rel="stylesheet" href="/assets1/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets1/fonts/style.css" />
        <link rel="stylesheet" href="/assets1/css/main.min.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="stylesheet" href="/assets1/vendor/daterange/daterange.css" />
      </head>

      {/* Header Component */}
      <header className="bg-blue-800 p-4 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="text-white">Trang Chủ</Link>
          <Link to="/products" className="text-white">Sản Phẩm</Link>
          <Link to="/contact" className="text-white">Liên Hệ</Link>
        </nav>
      </header>
    </>
  );
};

export default Header;
