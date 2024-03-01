import { FaStore } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdLocalShipping } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";
import { MdDiscount } from "react-icons/md";
import { FaFolderPlus } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  IconBulb,
  IconMapPin,
  IconCart,
  IconBox,
  IconArticle,
  IconShoppingBag,
} from "@douyinfe/semi-icons";
export const ManagerNavigation = [
  {
    type: "item",
    icon: <FaHome className="text-xl icon-nav" />,
    itemKey: "home",
    text: "Home",
    link: `/`,
  },
  {
    type: "sub",
    itemKey: "product",
    text: "Product Management",
    icon: <FaStore className="w-5 p-0 icon-nav" />,
    items: [
      {
        type: "item",
        itemKey: "product-list",
        text: "List",
        link: "/adminPage/product/product-list",
        icon: <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
      {
        type: "item",
        itemKey: "product-create",
        text: "Create",
        link: "/adminPage/product/product-create",
        icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
    ],
  },

  {
    type: "sub",
    itemKey: "category",
    text: "Category Management",
    icon: <BiSolidCategory className="w-5 h-5 p-0 icon-nav" />,
    items: [
      {
        type: "item",
        itemKey: "category-list",
        text: "List",
        link: "/adminPage/category/category-list",
        icon: <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
      {
        type: "item",
        itemKey: "category-create",
        text: "Create",
        link: "/adminPage/category/category-create",
        icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
    ],
  },

  {
    type: "item",
    icon: <MdLocalShipping className="w-5 h-5 p-0 icon-nav" />,
    itemKey: "order",
    text: "Order Management",
    link: `/adminPage/order/order-list`,
    className: "!font-semibold hover:bg-gray-100",
  },

  {
    type: "sub",
    itemKey: "statistical",
    text: "Statistical Management",
    icon: <FcStatistics className="w-5 h-5 p-0 icon-nav" />,
    items: [
      {
        type: "item",
        itemKey: "statistics-of-best-selling-products",
        text: "Statistics of best-selling products",
        link: "/adminPage/statistical/statistics-of-best-selling-products",
      },
      {
        type: "item",
        itemKey: "statistics-of-comment-product",
        text: "Product statistics by number of comments",
        link: "/adminPage/statistical/statistics-of-comment-product",
      },
      {
        type: "item",
        itemKey: "statistics-of-user-buy-product",
        text: "User statistics according to number of successful purchases",
        link: "/adminPage/statistical/statistics-of-user-buy-product",
      },
      {
        type: "item",
        itemKey: "statistics-of-user-comment",
        text: "User statistics according to number of comments",
        link: "/adminPage/statistical/statistics-of-user-comment",
      },
    ],
  },

  {
    type: "sub",
    itemKey: "blog-management",
    text: "Blog Management",
    icon: <FaBlog className="w-5 h-5 p-0 icon-nav" />,
    items: [
      {
        type: "item",
        itemKey: "blog-list",
        text: "List",
        link: "/adminPage/blog/blog-list",
        icon: <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
      {
        type: "item",
        itemKey: "blog-create",
        text: "Create",
        link: "/adminPage/blog/blog-create",
        icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
    ],
  },

  {
    type: "sub",
    itemKey: "promotion",
    text: "Promotion Management",
    icon: <MdDiscount className="w-5 h-5 p-0 icon-nav" />,
    items: [
      {
        type: "item",
        itemKey: "promotion-list",
        text: "List",
        link: "/adminPage/promotion/promotion-list",
        icon: <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
      {
        type: "item",
        itemKey: "promotion-create",
        text: "Create",
        link: "/adminPage/promotion/promotion-create",
        icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
      },
    ],
  },

  {
    type: "item",
    icon: <FaMapMarkedAlt className="w-5 h-5 p-0 icon-nav" />,
    itemKey: "location",
    text: "Location Management",
    link: `/adminPage/location`,
    className: "!font-semibold hover:bg-gray-100",
  },
];

export const CustomerNavigation = [
  {
    type: "item",
    itemKey: "product",
    text: "Product",
    icon: <IconShoppingBag />,
    link: "/customerPage/product/product-list",
  },
  {
    type: "item",
    itemKey: "blog",
    text: "Blog",
    icon: <IconArticle />,
    link: "/customerPage/blog/blog-list",
  },
  {
    type: "item",
    itemKey: "aihelp",
    text: "AI Help",
    icon: <IconBulb />,
    link: "/customerPage/AI",
  },
  {
    type: "item",
    text: "Location",
    icon: <IconMapPin />,
    itemKey: "location",
    link: "/customerPage/location",
  },
  {
    type: "item",
    text: "Cart",
    icon: <IconCart />,
    itemKey: "cart",
    link: "/",
  },
  // {
  //   text: "My Order",
  //   icon: <IconSetting />,
  //   itemKey: "myorder",
  //   link: "/customerPage/order-history/order-list",
  // },
  {
    type: "item",
    text: "Order",
    icon: <IconBox />,
    itemKey: "order",
    link: "/",
  },
];
