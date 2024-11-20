import { Dropdown, List, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const data = [
  {
    title: "QUẦN ÁO THƯƠNG HIỆU",
    to: "/",
    children: [
      {
        title: "ADIDAS",
        to: "products?title=brand&sort=adidas",
      },
      {
        title: "NIKE",
        to: "products?title=brand&sort=nike",
      },
    ],
  },
  {
    title: "CẦU LÔNG",
    to: "/",
    children: [
      {
        title: "VỢT CẦU LÔNG",
        to: "products?title=category&sort=vợt cầu lông",
      },
      {
        title: "GIÀY CẦU LÔNG",
        to: "products?title=category&sort=giày cầu lông",
      },
    ],
  },
  {
    title: "KHUYẾN MÃI",
    to: "/",
    children: [
      // {
      //   title: "HÀNG ĐANG GIẢM GIÁ",
      //   to: "hang-dang-giam-gia",
      // },
      // {
      //   title: "HÀNG ĐANG XẢ GIÁ SHOCK",
      //   to: "hang-dang-xa-gia-shock",
      // },
      {
        title: "HÀNG ĐANG KHUYẾN MÃI",
        to: "products?title=Sale&sort=true",
      },
    ],
  },
];
export default function CategoryDropdown({
  isbordered,
  isMenu = false,
  className = "",
}) {
  const menuCategories = (
    <Menu className="mt-3 bg-white">
      <Menu.Item
        key="quality"
        className="p-2 text-2xl border-b border-b-gray-100"
      >
        Chất lượng sản phẩm
      </Menu.Item>
      <Menu.Item
        key="delivery"
        className="p-2 text-2xl border-b border-b-gray-100"
      >
        Phân phối sỉ toàn quốc
      </Menu.Item>
      <Menu.Item
        key="various"
        className="p-2 text-2xl border-b border-b-gray-100"
      >
        Mặt hàng đa dạng
      </Menu.Item>
      <Menu.Item
        key="super"
        className="p-2 text-2xl border-b border-b-gray-100"
      >
        Giao hàng nhanh chóng
      </Menu.Item>
    </Menu>
  );

  return (
    <List
      bordered={isbordered !== undefined ? isbordered : false}
      size="small"
      dataSource={data}
      className={className}
      renderItem={(item) => {
        item.children.map((subItem) => ({
          key: subItem.to,
          label: <Link to={`/${subItem.to}`}>{subItem.title}</Link>,
        }));
        return (
          <List.Item key={item.to}>
            <Dropdown
              dropdownRender={() => menuCategories}
              trigger={["hover"]}
              placement="bottomLeft"
              autoAdjustOverflow
            >
              <Link
                className="flex flex-row w-full h-full items-cente justify-centerr"
                to={`/${item.to}`}
              >
                {isMenu ? (
                  <>
                    <MdOutlineKeyboardArrowLeft
                      size={30}
                      className="text-black/30"
                    />
                    {item.title}
                  </>
                ) : (
                  <>
                    {item.title}
                    <MdOutlineKeyboardArrowRight
                      size={24}
                      className="text-black"
                    />
                  </>
                )}
              </Link>
            </Dropdown>
          </List.Item>
        );
      }}
    />
  );
}
