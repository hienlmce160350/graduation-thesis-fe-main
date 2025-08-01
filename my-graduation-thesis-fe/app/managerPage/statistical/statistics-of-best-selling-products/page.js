"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Avatar,
  Empty,
  Typography,
  DatePicker,
  Input,
} from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../context/withAuth";
import { debounce } from "@/libs/commonFunction";
import { IconSearch } from "@douyinfe/semi-icons";
import { formatCurrency } from "@/libs/commonFunction";

const { Text } = Typography;

const Statistical01 = () => {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // test filter
  const [filteredValue, setFilteredValue] = useState([]);
  const compositionRef = useRef({ isComposition: false });

  const handleChange = (value) => {
    if (compositionRef.current.isComposition) {
      return;
    }
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };
  const debouncedHandleChange = debounce(handleChange, 1000);
  const handleCompositionStart = () => {
    compositionRef.current.isComposition = true;
  };

  const handleCompositionEnd = (event) => {
    compositionRef.current.isComposition = false;
    const value = event.target.value;
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };
  // end test filter

  const columns = [
    {
      title: "Top",
      dataIndex: "key",
      render: (text, record, index) => {
        return <span>{Number(text) + 1}</span>;
      },
    },

    {
      title: "Product Name",
      dataIndex: "name",
      render: (text, record, index) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              shape="square"
              src={record.imagePath}
              style={{ marginRight: 12 }}
            ></Avatar>
            {/* The width calculation method is the cell setting width minus the non-text content width */}
            <Text heading={5} ellipsis={{ showTooltip: true }}>
              {text}
            </Text>
          </span>
        );
      },
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (text, record, index) => {
        return (
          <span className="whitespace-nowrap">{formatCurrency(text)} đ</span>
        );
      },
    },
  ];

  // format Date
  function formatDate(inputDate) {
    // Tạo một đối tượng Date từ chuỗi ngày đầu vào
    const dateObject = new Date(inputDate);

    // Lấy các thành phần ngày, tháng, năm
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = dateObject.getFullYear();

    // Định dạng thành chuỗi "mm/dd/yyyy"
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }
  // end format date

  const getData = async () => {
    setLoading(true);
    const bearerToken = Cookies.get("token");

    let res;
    if (
      formatDate(startDate) == "NaN/NaN/NaN" &&
      formatDate(endDate) == "NaN/NaN/NaN"
    ) {
      res = await fetch(
        `https://ersmanager.azurewebsites.net/api/Statistical/getAll`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else if (formatDate(startDate) == "NaN/NaN/NaN") {
      res = await fetch(
        `https://ersmanager.azurewebsites.net/api/Statistical/getAll?EndDate=${formatDate(
          endDate
        )}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else if (formatDate(endDate) == "NaN/NaN/NaN") {
      res = await fetch(
        `https://ersmanager.azurewebsites.net/api/Statistical/getAll?StartDate=${formatDate(
          startDate
        )}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.log(
        "Date: " +
          `https://ersmanager.azurewebsites.net/api/Statistical/getAll?StartDate=${formatDate(
            startDate
          )}&EndDate=${formatDate(endDate)}`
      );
      res = await fetch(
        `https://ersmanager.azurewebsites.net/api/Statistical/getAll?StartDate=${formatDate(
          startDate
        )}&EndDate=${formatDate(endDate)}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (res.ok) {
      let data = await res.json();
      data = data.map((item, index) => ({
        ...item,
        key: index.toString(), // Sử dụng index của mỗi object cộng dồn từ 0 trở lên
      }));
      setLoading(false);
      return data;
    } else {
      setLoading(false);
    }
  };

  // End API
  const fetchData = async () => {
    try {
      const data = await getData();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeDate = (date) => {
    setStartDate(date[0]);
    setEndDate(date[1]);
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"No result"}
    />
  );

  return (
    <>
      <LocaleProvider locale={en_US}>
        <div className="mx-auto w-full mt-3 h-fit mb-3">
          <h2 className="text-[32px] font-medium mb-3 ">
            Best-selling products
          </h2>
          {/* <Button onClick={show} className="mb-4">
            Filter by Start Date & End Date
          </Button> */}

          <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
            <div className="flex w-full items-center mt-4 justify-between mb-4 gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Input filter product name"
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onChange={debouncedHandleChange}
                  className="min-w-[280px] transition duration-250 ease-linear focus:!outline-none focus:!border-green-500 active:!border-green-500 hover:!border-[#74A65D] !rounded-[3px] !w-2/5 !h-11 !border border-solid !border-[#cccccc] !bg-white"
                  showClear
                  suffix={<IconSearch className="!text-2xl" />}
                />
              </div>
              <div className="flex">
                <DatePicker
                  type="dateRange"
                  density="compact"
                  className="w-[260px] !border-[#cccccc]"
                  position="bottomRight"
                  onChange={handleChangeDate}
                />
              </div>
            </div>
            <Table
              style={{ minHeight: "fit-content" }}
              columns={columns}
              dataSource={dataSource}
              empty={empty}
              loading={loading}
            />
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};

export default withAuth(Statistical01, "manager");
