"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Typography,
  Select,
  List,
  Avatar,
  Dropdown,
  Table,
  Empty,
  Pagination,
} from "@douyinfe/semi-ui";
import { PiCurrencyDollarBold } from "react-icons/pi";
import { GoArrowUp } from "react-icons/go";
import { GoArrowDown } from "react-icons/go";
import { MdPeopleAlt } from "react-icons/md";
import Cookies from "js-cookie";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { IoMdMore } from "react-icons/io";
import Link from "next/link";
import { IconMore } from "@douyinfe/semi-icons";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import { FaPen } from "react-icons/fa";
import MyChartComponent from "../../components/chartCombine";
import { formatCurrency } from "@/libs/commonFunction";

const Demo = () => {
  const { Text } = Typography;
  const [productData, setProductData] = useState([]);
  const [dataOrderMain, setDataOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [totalUser, setTotalUser] = useState();
  const [totalCost, setTotalCost] = useState();
  const [totalBlogView, setTotalBlogView] = useState();
  const [totalProfit, setTotalProfit] = useState();
  const pageSize = 6;
  const [page, setProductPage] = useState(1);
  const productsPerPage = 5;

  // Xử lí increase or decrease profit
  const [profitChange, setProfitChange] = useState(false);

  // Xử lí increase or decrease customer
  const [customerChange, setCustomerChange] = useState(false);

  // Chênh lệch profit của tháng hiện tại và tháng trước
  const [currentMonthProfit, setCurrentMonthProfit] = useState(0);
  const [lastMonthProfit, setLastMonthProfit] = useState(0);
  const [profitDifferencePercent, setProfitDifferencePercent] = useState(0);
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  const calculateProfitDifference = (currentMonthProfit, lastMonthProfit) => {
    if (lastMonthProfit === 0) {
      setProfitChange(true);
      return 100;
    } // To avoid division by zero
    else if (currentMonthProfit < lastMonthProfit) {
      setProfitChange(false);
      return Math.round(
        (((currentMonthProfit - lastMonthProfit) * -1) / lastMonthProfit) * 100
      );
    } else if (currentMonthProfit > lastMonthProfit) {
      setProfitChange(true);
      return Math.round(
        ((currentMonthProfit - lastMonthProfit) / lastMonthProfit) * 100
      );
    }
  };
  // End Chênh lệch profit của tháng hiện tại và tháng trước

  // Chênh lệch customer của tháng hiện tại và tháng trước
  const [currentMonthCustomer, setCurrentMonthCustomer] = useState(0);
  const [lastMonthCustomer, setLastMonthCustomer] = useState(0);
  const [customerDifferencePercent, setCustomerDifferencePercent] = useState(0);
  const calculateCustomerDifference = (
    currentMonthCustomer,
    lastMonthCustomer
  ) => {
    if (lastMonthCustomer === 0) {
      setCustomerChange(true);
      return 100;
    } // To avoid division by zero
    else if (currentMonthCustomer < lastMonthCustomer) {
      setCustomerChange(false);
      return Math.round(
        (((currentMonthCustomer - lastMonthCustomer) * -1) /
          lastMonthCustomer) *
          100
      );
    } else if (currentMonthCustomer > lastMonthCustomer) {
      setCustomerChange(true);
      return Math.round(
        ((currentMonthCustomer - lastMonthCustomer) / lastMonthCustomer) * 100
      );
    }
  };
  // End Chênh lệch profit của tháng hiện tại và tháng trước

  // Card
  const [loadingCost, setLoadingCost] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingProfit, setLoadingProfit] = useState(false);
  const [loadingBlogView, setLoadingBlogView] = useState(false);

  // filter language
  const [countryName, setCountryName] = useState("en");

  const handleCountryNameChange = (value) => {
    setCountryName(value);
  };

  const list = [
    {
      id: "en",
      name: "USA",
      avatar: "/staticImage/usa-flag-round-circle-icon.svg",
    },
    {
      id: "vi",
      name: "VietNam",
      avatar: "/staticImage/vietnam-flag-round-circle-icon.svg",
    },
  ];

  const renderSelectedItem = (optionNode) => (
    <div
      key={optionNode.name}
      style={{ display: "flex", alignItems: "center" }}
    >
      <Avatar src={optionNode.avatar} size="extra-small">
        {optionNode.abbr}
      </Avatar>
    </div>
  );

  const renderCustomOption = (item, index) => {
    const optionStyle = {
      display: "flex",
      paddingLeft: 24,
      paddingTop: 10,
      paddingBottom: 10,
    };
    return (
      <Select.Option
        value={item.id}
        style={optionStyle}
        showTick={true}
        {...item}
        key={item.id}
      >
        <Avatar size="extra-small" src={item.avatar} />
        <div style={{ marginLeft: 8 }}>
          <div style={{ fontSize: 14 }}>{item.name}</div>
        </div>
      </Select.Option>
    );
  };

  // end filter language

  const handleSend = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Products/GetAll?LanguageId=${encodeURIComponent(
        countryName
      )}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      setLoading(false);
    }
    let data = await res.json();
    data = data.map((item, index) => ({
      ...item,
      key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
    }));
    setProductData(data);
    return data;
  };

  // Get total user
  const getTotalUser = async () => {
    setLoadingUser(true);
    const res = await fetch(
      `https://ersadmin.azurewebsites.net/api/Users/GetTotalUser`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      let data = await res.json();
      setTotalUser(data);
      setLoadingUser(false);
      return data;
    } else {
      setLoadingUser(false);
    }
  };
  // End get total user

  // Get total User Current
  const getTotalUserCurrent = async () => {
    setLoadingUser(true);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentMonthResponse = await fetch(
      `https://ersadmin.azurewebsites.net/api/Users/GetTotalUser?startDate=${currentMonth}%2F01%2F${currentYear}&endDate=${currentMonth}%2F${getDaysInMonth(
        currentMonth,
        currentYear
      )}%2F${currentYear}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const lastMonthResponse = await fetch(
      `https://ersadmin.azurewebsites.net/api/Users/GetTotalUser?startDate=${lastMonth}%2F01%2F${lastYear}&endDate=${lastMonth}%2F${getDaysInMonth(
        lastMonth,
        lastYear
      )}%2F${lastYear}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (currentMonthResponse.ok && lastMonthResponse.ok) {
      let currentMonthData = await currentMonthResponse.json();
      setCurrentMonthCustomer(currentMonthData);
      let lastMonthData = await lastMonthResponse.json();
      setLastMonthCustomer(lastMonthData);
      setLoadingUser(false);
      return;
    } else {
      setLoadingUser(false);
    }
  };
  // End get total user current

  // Get total Cost
  const getTotalCost = async () => {
    setLoadingCost(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Products/GetSumOfCost`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      let data = await res.json();
      setTotalCost(data);
      setLoadingCost(false);
      return data;
    } else {
      setLoadingCost(false);
    }
  };
  // End get total user

  // Get total BlogView
  const getTotalBlogView = async () => {
    setLoadingBlogView(true);
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Blogs/Viewcount`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      let data = await res.json();
      setTotalBlogView(data);
      setLoadingBlogView(false);
      return data;
    } else {
      setLoadingBlogView(false);
    }
  };
  // End get total user

  // Get total Profit Current
  const getTotalProfitCurrent = async () => {
    setLoadingProfit(true);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const bearerToken = Cookies.get("token");
    const currentMonthResponse = await fetch(
      `https://ersmanager.azurewebsites.net/api/Orders/GetTotalProfit?startDate=${currentMonth}%2F01%2F${currentYear}&endDate=${currentMonth}%2F${getDaysInMonth(
        currentMonth,
        currentYear
      )}%2F${currentYear}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const lastMonthResponse = await fetch(
      `https://ersmanager.azurewebsites.net/api/Orders/GetTotalProfit?startDate=${lastMonth}%2F01%2F${lastYear}&endDate=${lastMonth}%2F${getDaysInMonth(
        lastMonth,
        lastYear
      )}%2F${lastYear}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (currentMonthResponse.ok && lastMonthResponse.ok) {
      let currentMonthData = await currentMonthResponse.json();
      setCurrentMonthProfit(currentMonthData);
      let lastMonthData = await lastMonthResponse.json();
      setLastMonthProfit(lastMonthData);
      setLoadingProfit(false);
      return;
    } else {
      setLoadingProfit(false);
    }
  };
  // End get total profit current

  // Get total Profit
  const getTotalProfit = async () => {
    setLoadingProfit(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Orders/GetTotalProfit`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      let data = await res.json();
      setTotalProfit(data);
      setLoadingProfit(false);
      return data;
    } else {
      setLoadingProfit(false);
    }
  };
  // End get total profit

  const data = productData;

  // Handle datetime
  const TimeAgo = ({ date }) => {
    // Tính sự chênh lệch giữa thời gian hiện tại và dateCreated
    const timeDiff = new Date() - new Date(date + "Z");

    // Chuyển đổi sự chênh lệch thành năm, tháng, ngày, giờ, phút hoặc giây
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30 * 12));
    const months = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30)
    );
    const days = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Xác định và trả về kết quả phù hợp
    if (years > 0) {
      return <span>Updated {years} about years ago</span>;
    } else if (months > 0) {
      return <span>Updated {months} months ago</span>;
    } else if (days > 0) {
      return <span>Updated {days} days ago</span>;
    } else if (hours > 0) {
      return <span>Updated {hours} hours ago</span>;
    } else if (minutes > 0) {
      return <span>Updated {minutes} minutes ago</span>;
    } else {
      return <span>Updated {seconds} seconds ago</span>;
    }
  };
  // End handle datetime

  // filter order status
  const [orderStatus, setOrderStatus] = useState("");

  const handleOrderStatusChange = (value) => {
    setOrderStatus(value);
  };

  // end filter status

  // Latest Orders
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "shipName",
    },
    {
      title: "Ship Address",
      dataIndex: "shipAddress",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      render: (text, record, index) => {
        const date = new Date(text);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        return <span className="whitespace-nowrap">{formattedDate}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record, index) => {
        let statusColor, statusText, statusColorText;

        switch (text) {
          case 0:
            statusColor =
              "bg-[#f0f6ff] text-[#2463eb] border border-[#2463eb] w-fit rounded-md px-2 flex items-center whitespace-nowrap";
            statusText = "In Progress";
            break;
          case 1:
            statusColor =
              "bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2 flex items-center whitespace-nowrap";
            statusText = "Confirmed";
            break;
          case 2:
            statusColor =
              "bg-[#fefce7] text-[#c88a04] border border-[#c88a04] w-fit rounded-md px-2 flex items-center whitespace-nowrap"; // Chọn màu tương ứng với Shipping
            statusText = "Shipping";
            break;
          case 3:
            statusColor =
              "bg-[#f2fdf5] text-[#16a249] border border-[#16a249] w-fit rounded-md px-2 flex items-center whitespace-nowrap"; // Chọn màu tương ứng với Success
            statusText = "Success";
            break;
          case 4:
            statusColor =
              "bg-[#fef1f1] text-[#dc2828] border border-[#dc2828] w-fit rounded-md px-2 flex items-center whitespace-nowrap"; // Chọn màu tương ứng với Canceled
            statusText = "Cancelled";
            break;
          case 5:
            statusColor =
              "bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] w-fit rounded-md px-2 flex items-center whitespace-nowrap"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Refunded";
            break;
        }

        return (
          <>
            <div className={statusColor}>{statusText}</div>
          </>
        );
      },
    },

    {
      title: "",
      dataIndex: "operate",
      render: (text, record) => {
        return (
          <Dropdown
            trigger={"click"}
            position={"bottom"}
            render={
              <Dropdown.Menu>
                <Link href={`/managerPage/order/order-edit/${record.id}`}>
                  <Dropdown.Item>
                    <FaPen className="pr-2 text-2xl" />
                    Edit Order
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            }
          >
            <IconMore className="cursor-pointer" />
          </Dropdown>
        );
      },
    },
  ];

  let count = 1;
  const handleSendOrder = async () => {
    setLoadingOrder(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanager.azurewebsites.net/api/Orders/GetAllByOrderStatus?Status=${encodeURIComponent(
        orderStatus
      )}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let dataOrder = await res.json();
    dataOrder = dataOrder.map((item, index) => ({
      ...item,
      key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
    }));
    setDataOrder(dataOrder);
    setTotal(dataOrder.length);
    if (count == 1) {
      await fetchData(1, dataOrder, count);
      count += 1;
    } else {
      await fetchData(1);
    }
    return dataOrder;
  };

  const fetchData = async (currentPage, dataOrder, countFetch) => {
    setPage(currentPage);
    if (countFetch == 1) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          let dataSource = dataOrder.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          res(dataSource);
        }, 300);
      }).then((dataSource) => {
        setLoadingOrder(false);
        setData(dataSource);
      });
    } else {
      return new Promise((res, rej) => {
        setTimeout(() => {
          let dataSource = dataOrderMain.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          res(dataSource);
        }, 300);
      }).then((dataSource) => {
        setLoadingOrder(false);
        setData(dataSource);
      });
    }
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No result"}
    />
  );
  // End Latest

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChange = (currentPage) => {
    setProductPage(currentPage);
  };

  const totalPages = Math.ceil(data.length / productsPerPage);

  // Lấy dữ liệu của trang hiện tại
  const currentPageData = data.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  useEffect(() => {
    handleSend();
    handleSendOrder();
    getTotalUser();
    getTotalCost();
    getTotalProfit();
    getTotalBlogView();
    getTotalProfitCurrent();
    let differencePercent = calculateProfitDifference(
      currentMonthProfit,
      lastMonthProfit
    );
    setProfitDifferencePercent(differencePercent);

    getTotalUserCurrent();
    let differencePercentCustomer = calculateCustomerDifference(
      currentMonthCustomer,
      lastMonthCustomer
    );
    setCustomerDifferencePercent(differencePercentCustomer);
  }, [
    countryName,
    orderStatus,
    currentMonthProfit,
    lastMonthProfit,
    currentMonthCustomer,
    lastMonthCustomer,
  ]);
  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card
                key={0}
                title={
                  <div>
                    <p className="mb-4 font-medium">BUDGET</p>
                  </div>
                }
                className="shadow-md z-10 !rounded-xl"
                headerStyle={{ paddingBottom: 0 }}
                headerLine={false}
                style={{ width: "100%" }}
                bodyStyle={{ paddingTop: 0, marginTop: "-4px" }}
                headerExtraContent={
                  <div className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                      <PiCurrencyDollarBold className="text-red-500 text-xs" />
                    </div>
                  </div>
                }
                loading={loadingCost}
              >
                <Text className="!text-2xl font-semibold">
                  {formatCurrency(totalCost)} đ
                </Text>
              </Card>

              <Card
                key={1}
                title={
                  <div>
                    <p className="mb-4 font-medium">TOTAL CUSTOMERS</p>
                  </div>
                }
                className="shadow-md z-10 !rounded-xl"
                headerStyle={{ paddingBottom: 0, marginRight: 0 }}
                headerLine={false}
                style={{ width: "100%" }}
                bodyStyle={{ paddingTop: 0, marginTop: "-4px" }}
                headerExtraContent={
                  <div className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center">
                    <div className=" rounded-full w-5 h-5 flex items-center justify-center">
                      <MdPeopleAlt className="text-white text-lg" />
                    </div>
                  </div>
                }
                loading={loadingUser}
              >
                <Text className="!text-2xl font-semibold">{totalUser}</Text>
                <div className="flex items-center gap-4 mt-4">
                  {customerChange ? (
                    <p className="text-green-500 flex items-center">
                      <GoArrowUp />
                      <span>{customerDifferencePercent}%</span>
                    </p>
                  ) : (
                    <p className="text-red-500 flex items-center">
                      <GoArrowDown />
                      <span>{customerDifferencePercent}%</span>
                    </p>
                  )}
                  <p>Since last month</p>
                </div>
              </Card>

              <Card
                key={2}
                title={
                  <div>
                    <p className="mb-4 font-medium">BLOG VIEWS</p>
                  </div>
                }
                className="shadow-md z-10 !rounded-xl"
                headerLine={false}
                headerStyle={{ paddingBottom: 0 }}
                style={{ width: "100%" }}
                bodyStyle={{ paddingTop: 0, marginTop: "-4px" }}
                headerExtraContent={
                  <div className="w-11 h-11 bg-yellow-500 rounded-full flex items-center justify-center">
                    <div className="bg-yellown-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <PiCurrencyDollarBold className="text-white text-md" />
                    </div>
                  </div>
                }
                loading={loadingBlogView}
              >
                <Text className="!text-2xl font-semibold">{totalBlogView}</Text>
              </Card>

              <Card
                key={3}
                title={
                  <div>
                    <p className="mb-4 font-medium">TOTAL PROFIT</p>
                  </div>
                }
                className="shadow-md z-10 !rounded-xl"
                headerLine={false}
                headerStyle={{ paddingBottom: 0, marginRight: 0 }}
                style={{ width: "100%" }}
                bodyStyle={{ paddingTop: 0, marginTop: "-4px" }}
                headerExtraContent={
                  <div className="w-11 h-11 bg-indigo-500 rounded-full flex items-center justify-center">
                    <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                      <PiCurrencyDollarBold className="text-indigo-500 text-xs" />
                    </div>
                  </div>
                }
                loading={loadingProfit}
              >
                <Text className="!text-2xl font-semibold">
                  {formatCurrency(totalProfit)} đ
                </Text>
                <div className="flex items-center gap-4 mt-4">
                  {profitChange ? (
                    <p className="text-green-500 flex items-center">
                      <GoArrowUp />
                      <span>{profitDifferencePercent}%</span>
                    </p>
                  ) : (
                    <p className="text-red-500 flex items-center">
                      <GoArrowDown />
                      <span>{profitDifferencePercent}%</span>
                    </p>
                  )}
                  <p>Since last month</p>
                </div>
              </Card>
            </div>

            {/* <div>{ReverseExampleNoSnap()}</div> */}

            <div className="w-full shadow-md z-10 !rounded-xl border mt-6 p-3">
              <h3 className="font-semibold text-lg">Sales</h3>
              <MyChartComponent />
            </div>

            <div className="grid lg:grid-cols-3 mt-6 gap-2">
              <div className="shadow-md z-10 !rounded-xl border">
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-semibold text-lg">Latest Product</h3>
                  <Select
                    placeholder="Please select country"
                    style={{ height: 40 }}
                    onChange={handleCountryNameChange}
                    defaultValue={"en"}
                    renderSelectedItem={renderSelectedItem}
                  >
                    {list.map((item, index) => renderCustomOption(item, index))}
                  </Select>
                </div>

                <div>
                  <List
                    loading={loading}
                    dataSource={currentPageData}
                    renderItem={(item) => (
                      <List.Item
                        header={
                          <Avatar
                            size="small"
                            shape="square"
                            src={item.thumbnailImage}
                          ></Avatar>
                        }
                        main={
                          <div className="flex flex-col font-light">
                            <span
                              style={{
                                color: "var(--semi-color-text-0)",
                                fontWeight: 600,
                              }}
                            >
                              {item.name}
                            </span>
                            <TimeAgo date={item.dateModified} />
                          </div>
                        }
                        extra={
                          <Dropdown
                            trigger={"click"}
                            position={"bottom"}
                            render={
                              <Dropdown.Menu>
                                <Link
                                  href={`/managerPage/product/product-edit/${item.id}`}
                                >
                                  <Dropdown.Item>
                                    View Product Detail
                                  </Dropdown.Item>
                                </Link>
                              </Dropdown.Menu>
                            }
                          >
                            <div>
                              <IoMdMore className="cursor-pointer text-lg" />
                            </div>
                          </Dropdown>
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex justify-center my-4">
                  <Pagination
                    className="text-white"
                    total={totalPages * 10}
                    currentPage={page}
                    onPageChange={onPageChange}
                  ></Pagination>
                </div>
              </div>
              <div className="lg:col-span-2 shadow-md z-10 !rounded-xl border">
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-semibold text-lg">Latest Order</h3>
                  <Select
                    onChange={handleOrderStatusChange}
                    className="ml-2"
                    style={{ height: 40 }}
                    placeholder="Select Order Status"
                    loading={loadingOrder}
                    defaultValue={""}
                  >
                    <Select.Option key={0} value={""}>
                      All Status
                    </Select.Option>
                    <Select.Option key={1} value={0}>
                      In Progress
                    </Select.Option>
                    <Select.Option key={2} value={1}>
                      Confirmed
                    </Select.Option>
                    <Select.Option key={3} value={2}>
                      Shipping
                    </Select.Option>
                    <Select.Option key={4} value={3}>
                      Success
                    </Select.Option>
                    <Select.Option key={5} value={4}>
                      Canceled
                    </Select.Option>
                    <Select.Option key={6} value={5}>
                      Refunded
                    </Select.Option>
                  </Select>
                </div>
                <Table
                  style={{ minHeight: "fit-content" }}
                  columns={columns}
                  dataSource={dataSource}
                  className="!p-3 !pt-0"
                  pagination={{
                    currentPage,
                    pageSize: 6,
                    total: totalItem,
                    onPageChange: handlePageChange,
                  }}
                  empty={empty}
                  loading={loadingOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};
export default Demo;
