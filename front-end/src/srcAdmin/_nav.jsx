import CIcon from "@coreui/icons-react";
import {
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  {
    component: CNavItem,
    name: "Người dùng",
    to: "/admin/user",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Phụ trợ",
  },
  {
    component: CNavItem,
    name: "Thể loại",
    to: "/admin/category",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Màu sắc",
    to: "/admin/color",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Nhãn hàng",
    to: "/admin/brand",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Nhận xét",
    to: "/admin/review",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Liên hệ",
    to: "/admin/contact",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  //   {
  //     component: CNavItem,
  //     name: "Docs",
  //     href: "https://coreui.io/react/docs/templates/installation/",
  //     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  //   },
  {
    component: CNavTitle,
    name: "Chính",
  },
  {
    component: CNavItem,
    name: "Sản phẩm",
    to: "/admin/product",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Dịch vụ",
    to: "/admin/service",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Đặt hàng",
    to: "/admin/order",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  //   {
  //     component: CNavGroup,
  //     name: "Base",
  //     to: "/admin/base",
  //     icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //     items: [
  //       {
  //         component: CNavItem,
  //         name: "Tables",
  //         to: "/admin/base/tables",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Tabs",
  //         to: "/admin/base/tabs",
  //       },
  //     ],
  //   },
  //   {
  //     component: CNavGroup,
  //     name: "Buttons",
  //     to: "/admin/buttons",
  //     icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //     items: [
  //       {
  //         component: CNavItem,
  //         name: "Buttons",
  //         to: "/admin/buttons/buttons",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Buttons groups",
  //         to: "/admin/buttons/button-groups",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Dropdowns",
  //         to: "/admin/buttons/dropdowns",
  //       },
  //     ],
  //   },
  //   {
  //     component: CNavGroup,
  //     name: "Forms",
  //     icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //     items: [
  //       {
  //         component: CNavItem,
  //         name: "Form Control",
  //         to: "/admin/forms/form-control",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Select",
  //         to: "/admin/forms/select",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Checks & Radios",
  //         to: "/admin/forms/checks-radios",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Range",
  //         to: "/admin/forms/range",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Input Group",
  //         to: "/admin/forms/input-group",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Floating Labels",
  //         to: "/admin/forms/floating-labels",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Layout",
  //         to: "/admin/forms/layout",
  //       },
  //       {
  //         component: CNavItem,
  //         name: "Validation",
  //         to: "/admin/forms/validation",
  //       },
  //     ],
  //   },
  //   {
  //     component: CNavItem,
  //     name: "Charts",
  //     to: "/admin/charts",
  //     icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  //   },
  //   {
  //     component: CNavItem,
  //     name: "Widgets",
  //     to: "/admin/widgets",
  //     icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //     badge: {
  //       color: "info",
  //       text: "NEW",
  //     },
  //   },
];

export default _nav;
