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
import { BarChart } from "@mui/x-charts/BarChart";

import { IllustrationFailure } from "@douyinfe/semi-illustrations";
/* The following is available after version 1.13.0 */
import { IllustrationFailureDark } from "@douyinfe/semi-illustrations";

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
  const [totalProfit, setTotalProfit] = useState();
  const pageSize = 6;
  const [page, setProductPage] = useState(1);
  const productsPerPage = 2;
  const [chartData, setChartData] = useState([]);
  const [totalProductData, setTotalProductData] = useState([]);

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
      return (
        (((currentMonthProfit - lastMonthProfit) * -1) / lastMonthProfit) * 100
      );
    } else if (currentMonthProfit > lastMonthProfit) {
      setProfitChange(true);
      return ((currentMonthProfit - lastMonthProfit) / lastMonthProfit) * 100;
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
      return (
        (((currentMonthCustomer - lastMonthCustomer) * -1) /
          lastMonthCustomer) *
        100
      );
    } else if (currentMonthCustomer > lastMonthCustomer) {
      setCustomerChange(true);
      return (
        ((currentMonthCustomer - lastMonthCustomer) / lastMonthCustomer) * 100
      );
    }
  };
  // End Chênh lệch profit của tháng hiện tại và tháng trước

  // Card
  const [loadingCost, setLoadingCost] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingProfit, setLoadingProfit] = useState(false);

  // Chart
  const [loadingChartIncome, setLoadingChartIncome] = useState(false);
  const [loadingChartProduct, setLoadingChartProduct] = useState(false);

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
      `https://ersmanagerapi.azurewebsites.net/api/Products/GetAll?LanguageId=${encodeURIComponent(
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
    console.log("Data in send: " + JSON.stringify(data));
    return data;
  };

  // Get total user
  const getTotalUser = async () => {
    setLoadingUser(true);
    const res = await fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/GetTotalUser`,
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
      console.log("Fail get total user");
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
      `https://ersadminapi.azurewebsites.net/api/Users/GetTotalUser?startDate=${currentMonth}%2F01%2F${currentYear}&endDate=${currentMonth}%2F${getDaysInMonth(
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
      `https://ersadminapi.azurewebsites.net/api/Users/GetTotalUser?startDate=${lastMonth}%2F01%2F${lastYear}&endDate=${lastMonth}%2F${getDaysInMonth(
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
      console.log("Last Month: " + lastMonthData);
      console.log("Current Month: " + currentMonthData);
      setLastMonthCustomer(lastMonthData);
      setLoadingUser(false);
      return;
    } else {
      setLoadingUser(false);
      console.log("Fail get total profit");
    }
  };
  // End get total user current

  // Get total Cost
  const getTotalCost = async () => {
    setLoadingCost(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Products/GetSumOfCost`,
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
      console.log("Fail get total cost");
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
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetTotalProfit?startDate=${currentMonth}%2F01%2F${currentYear}&endDate=${currentMonth}%2F${getDaysInMonth(
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
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetTotalProfit?startDate=${lastMonth}%2F01%2F${lastYear}&endDate=${lastMonth}%2F${getDaysInMonth(
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
      console.log("Last Month: " + lastMonthData);
      console.log("Current Month: " + currentMonthData);
      setLastMonthProfit(lastMonthData);
      setLoadingProfit(false);
      return;
    } else {
      setLoadingProfit(false);
      console.log("Fail get total profit");
    }
  };
  // End get total profit current

  // Get total Profit
  const getTotalProfit = async () => {
    setLoadingProfit(true);
    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetTotalProfit`,
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
      console.log("Fail get total profit current");
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
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record, index) => {
        let statusColor, statusText;

        switch (text) {
          case 0:
            statusColor = "blue-500";
            statusText = "In Progress";
            break;
          case 1:
            statusColor = "green-400";
            statusText = "Confirmed";
            break;
          case 2:
            statusColor = "gray-200"; // Chọn màu tương ứng với Shipping
            statusText = "Shipping";
            break;
          case 3:
            statusColor = "green-400"; // Chọn màu tương ứng với Success
            statusText = "Success";
            break;
          case 4:
            statusColor = "red-400"; // Chọn màu tương ứng với Canceled
            statusText = "Canceled";
            break;
          default:
            statusColor = "black-400"; // Màu mặc định nếu không khớp trạng thái nào
            statusText = "Unknown";
            break;
        }

        return (
          <>
            <div className="flex items-center gap-1">
              <div
                class={`bg-${statusColor} border-3 border-${statusColor} rounded-full shadow-md h-3 w-3`}
              ></div>
              <span class={`text-${statusColor}`}>{statusText}</span>
            </div>
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
      `https://ersmanagerapi.azurewebsites.net/api/Orders/GetAllByOrderStatus?Status=${encodeURIComponent(
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
    console.log("Data in send: " + JSON.stringify(dataOrder));
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
          console.log("Data fetch: " + dataOrder);
          let dataSource = dataOrder.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          console.log("Data Source: " + dataSource);
          res(dataSource);
        }, 300);
      }).then((dataSource) => {
        setLoadingOrder(false);
        setData(dataSource);
      });
    } else {
      console.log("Hello 2");
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log("Data fetch: " + dataOrderMain);
          console.log("Order List: " + JSON.stringify(dataOrderMain));
          let dataSource = dataOrderMain.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          );
          console.log("Data Source: " + dataSource);
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

  // Chart

  // Tạo một mảng để lưu trữ giá trị từ API

  const chart = async () => {
    let profits = [];
    setLoadingChartIncome(true);
    // Lặp qua từ tháng 1 đến tháng 12
    for (let month = 1; month <= 12; month++) {
      // Xác định ngày đầu tiên của tháng
      let startDate = new Date(new Date().getFullYear(), month - 1, 1);
      // Xác định ngày cuối cùng của tháng
      let endDate = new Date(new Date().getFullYear(), month, 0);

      // Chuyển đổi định dạng ngày thành "DD/MM/YYYY"
      let formattedStartDate = `${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${startDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${startDate.getFullYear()}`;
      let formattedEndDate = `${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${endDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${endDate.getFullYear()}`;

      try {
        // Gọi API với các tham số startDate và endDate tương ứng
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Orders/GetTotalProfit?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Chuyển đổi response thành dạng JSON
        const data = await response.json();

        // Thêm giá trị nhận được vào mảng profits
        console.log("Data Profit: " + data);
        profits.push(data);
      } catch (error) {
        console.error(`Error fetching data for month ${month}: ${error}`);
      }
    }
    setChartData(profits);
    setLoadingChartIncome(false);
  };

  const chartProduct = async () => {
    let totalProduct = [];
    setLoadingChartProduct(true);
    // Lặp qua từ tháng 1 đến tháng 12
    for (let month = 1; month <= 12; month++) {
      // Xác định ngày đầu tiên của tháng
      let startDate = new Date(new Date().getFullYear(), month - 1, 1);
      // Xác định ngày cuối cùng của tháng
      let endDate = new Date(new Date().getFullYear(), month, 0);

      // Chuyển đổi định dạng ngày thành "DD/MM/YYYY"
      let formattedStartDate = `${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${startDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${startDate.getFullYear()}`;
      let formattedEndDate = `${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${endDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${endDate.getFullYear()}`;

      try {
        // Gọi API với các tham số startDate và endDate tương ứng
        const response = await fetch(
          `https://ersmanagerapi.azurewebsites.net/api/Statistical/GetTotalQuantity?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Chuyển đổi response thành dạng JSON
        const data = await response.json();

        // Thêm giá trị nhận được vào mảng profits
        console.log("Data Profit: " + data);
        totalProduct.push(data);
      } catch (error) {
        console.error(`Error fetching data for month ${month}: ${error}`);
      }
    }
    setTotalProductData(totalProduct);
    setLoadingChartProduct(false);
  };

  const SimpleBarChart = () => {
    let uData = [];
    let pData = [];
    if (chartData.length != 0 && totalProductData.length != 0) {
      console.log("Hello");
      uData = chartData;
      pData = totalProductData;
    } else {
      uData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      pData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    const xLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      <div className="w-full shadow-md z-10 !rounded-xl border mt-6 p-3">
        <h3 className="font-semibold text-lg">Sales</h3>
        {loadingChartIncome || loadingChartProduct ? ( // Nếu đang loading, hiển thị thông báo loading, ngược lại hiển thị biểu đồ
          <div>
            <Empty
              image={
                <IllustrationFailure style={{ width: 200, height: 200 }} />
              }
              darkModeImage={
                <IllustrationFailureDark style={{ width: 200, height: 200 }} />
              }
              description={"Loading..."}
            />
          </div>
        ) : (
          <BarChart
            height={400}
            series={[
              { data: uData, label: "Revenue", id: "revenue" },
              { data: pData, label: "Total Product", id: "totalProduct" },
            ]}
            xAxis={[{ data: xLabels, scaleType: "band" }]}
          />
        )}
      </div>
    );
  };
  // End Chart

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
    chart();
    chartProduct();
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
        <div className="m-auto w-full mb-10">
          <div className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card
              key={0}
              title={
                <div>
                  <p className="mb-4 font-medium">BUDGET</p>
                  <Text className="!text-2xl font-semibold">${totalCost}</Text>
                </div>
              }
              className="shadow-md z-10 !rounded-xl"
              headerLine={false}
              style={{ width: "100%" }}
              bodyStyle={{ paddingTop: 0 }}
              headerExtraContent={
                <div className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                    <PiCurrencyDollarBold className="text-red-500 text-xs" />
                  </div>
                </div>
              }
              loading={loadingCost}
            ></Card>

            <Card
              key={1}
              title={
                <div>
                  <p className="mb-4 font-medium">TOTAL CUSTOMERS</p>
                  <Text className="!text-2xl font-semibold">{totalUser}</Text>
                </div>
              }
              className="shadow-md z-10 !rounded-xl"
              headerStyle={{ marginRight: 0 }}
              headerLine={false}
              style={{ width: "100%" }}
              bodyStyle={{ paddingTop: 0 }}
              headerExtraContent={
                <div className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center">
                  <div className=" rounded-full w-5 h-5 flex items-center justify-center">
                    <MdPeopleAlt className="text-white text-lg" />
                  </div>
                </div>
              }
              loading={loadingUser}
            >
              <div className="flex items-center gap-4">
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
                  <p className="mb-4 font-medium">TASK PROGRESS</p>
                  <Text className="!text-2xl font-semibold">$24k</Text>
                </div>
              }
              className="shadow-md z-10 !rounded-xl"
              headerLine={false}
              style={{ width: "100%" }}
              bodyStyle={{ paddingTop: 0 }}
              headerExtraContent={
                <div className="w-11 h-11 bg-yellow-500 rounded-full flex items-center justify-center">
                  <div className="bg-yellown-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <PiCurrencyDollarBold className="text-white text-md" />
                  </div>
                </div>
              }
            >
              <div className="flex items-center gap-4">
                <p className="text-green-500 flex items-center">
                  <GoArrowUp />
                  <span>12%</span>
                </p>
                <p>Since last month</p>
              </div>
            </Card>

            <Card
              key={3}
              title={
                <div>
                  <p className="mb-4 font-medium">TOTAL PROFIT</p>
                  <Text className="!text-2xl font-semibold">
                    ${totalProfit}
                  </Text>
                </div>
              }
              className="shadow-md z-10 !rounded-xl"
              headerLine={false}
              style={{ width: "100%" }}
              bodyStyle={{ paddingTop: 0 }}
              headerExtraContent={
                <div className="w-11 h-11 bg-indigo-500 rounded-full flex items-center justify-center">
                  <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                    <PiCurrencyDollarBold className="text-indigo-500 text-xs" />
                  </div>
                </div>
              }
              loading={loadingProfit}
            >
              <div className="flex items-center gap-4">
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

          <div>{SimpleBarChart()}</div>

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
                                href={`/managerPage/product/product-edit/${countryName}/${item.id}`}
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
                  <Select.Option key={0} value={0}>
                    In Progress
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    Confirmed
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    Shipping
                  </Select.Option>
                  <Select.Option key={3} value={3}>
                    Success
                  </Select.Option>
                  <Select.Option key={4} value={4}>
                    Canceled
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
      </LocaleProvider>
    </>
  );
};
export default Demo;
