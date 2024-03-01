"use client";
import React, { useEffect, useState } from "react";
import { Table, Avatar, Button, Empty, Typography } from "@douyinfe/semi-ui";
import styles from "./StatisticScreen.module.css";
import Cookies from "js-cookie";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import { Notification } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { SideSheet, Banner, Form } from "@douyinfe/semi-ui";

const { Text } = Typography;

const Statistical01 = () => {
  const [dataSource, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalItem, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const handleStartDateChange = (value) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
  };

  const columns = [
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
            <Text
              heading={5}
              ellipsis={{ showTooltip: true }}
              style={{ width: "calc(400px - 76px)" }}
            >
              {text}
            </Text>
          </span>
        );
      },
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
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

  const handleSend = async () => {
    if (
      formatDate(startDate) === "NaN/NaN/NaN" ||
      formatDate(endDate) === "NaN/NaN/NaN"
    ) {
      if (
        formatDate(startDate) === "NaN/NaN/NaN" &&
        formatDate(endDate) === "NaN/NaN/NaN"
      ) {
        setStartDateError(true);
        setEndDateError(true);
        console.log("Check 0");

        return;
      } else if (
        formatDate(startDate) === "NaN/NaN/NaN" &&
        formatDate(endDate) !== "NaN/NaN/NaN"
      ) {
        setStartDateError(true);
        setEndDateError(false);
        return;
      } else if (
        formatDate(endDate) === "NaN/NaN/NaN" &&
        formatDate(startDate) !== "NaN/NaN/NaN"
      ) {
        console.log("Check 1");
        setStartDateError(false);
        setEndDateError(true);
        return;
      }
    }

    if (startDate || endDate) {
      if (startDate && endDate) {
        setStartDateError(false);
        setEndDateError(false);
        console.log("Check 2");
      } else if (startDate) {
        setStartDateError(false);
      } else if (endDate) {
        setEndDateError(false);
        console.log("Check 3");
      }
    }

    const bearerToken = Cookies.get("token");
    const res = await fetch(
      `https://ersmanagerapi.azurewebsites.net/api/Statistical/getAll?StartDate=${formatDate(
        startDate
      )}&EndDate=${formatDate(endDate)}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let data = await res.json();

    setTotal(data.length);
    fetchData(1, data);
    return data;
  };

  // Start SideSheet
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const { DatePicker, Select, Radio, RadioGroup } = Form;

  const footer = (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button style={{ marginRight: 8 }} onClick={handleCancel}>
        Cancel
      </Button>
      <Button theme="solid" onClick={handleSend}>
        Submit
      </Button>
    </div>
  );
  // End SideSheet

  const fetchData = async (currentPage, data) => {
    setLoading(true);
    setPage(currentPage);

    return new Promise((res, rej) => {
      setTimeout(() => {
        console.log("Data fetch: " + data);
        let dataSource = data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
        console.log("Data Source: " + dataSource);
        res(dataSource);
      }, 300);
    }).then((dataSource) => {
      setLoading(false);
      setData(dataSource);
    });
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

  useEffect(() => {}, [startDate, endDate]);

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
        <SideSheet
          title={
            <Typography.Title heading={4}>Statistics By Date</Typography.Title>
          }
          headerStyle={{ borderBottom: "1px solid var(--semi-color-border)" }}
          bodyStyle={{ borderBottom: "1px solid var(--semi-color-border)" }}
          visible={visible}
          footer={footer}
          onCancel={handleCancel}
        >
          <Form>
            <DatePicker
              field="date1"
              type="date"
              initValue={startDate}
              style={{ width: 272 }}
              label={{ text: "Start Date", required: true }}
              onChange={handleStartDateChange}
            />
            <DatePicker
              field="date2"
              type="date"
              initValue={endDate}
              style={{ width: 272 }}
              label={{ text: "End Date", required: true }}
              onChange={handleEndDateChange}
            />

            {startDateError == true ? (
              <Banner
                type="danger"
                className="mb-4"
                description={
                  <Typography.Text>Please select a start date.</Typography.Text>
                }
              />
            ) : (
              <span></span>
            )}

            {endDateError == true ? (
              <Banner
                type="danger"
                className="mb-4"
                description={
                  <Typography.Text>Please select an end date.</Typography.Text>
                }
              />
            ) : (
              <span></span>
            )}

            <Banner
              fullMode={false}
              icon={null}
              closeIcon={null}
              bordered
              description={
                <Typography.Text>
                  This form allows you to generate a report of the best-selling
                  products within a specified date range. Enter the start and
                  end dates to narrow down the period for the analysis. The
                  system will then provide you with information on the total
                  quantity and total price of the products sold during this
                  timeframe.
                </Typography.Text>
              }
            />
            <br />
          </Form>
        </SideSheet>

        <div className="m-auto w-[82%] mb-10">
          <h2 className="text-[32px] font-bold mb-3 ">
            Statistics of best-selling products
          </h2>
          <Button onClick={show} className="mb-4">
            Filter by Start Date & End Date
          </Button>
          <div className={styles.table}>
            <Table
              style={{ minHeight: "fit-content" }}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                currentPage,
                pageSize: 10,
                total: totalItem,
                onPageChange: handlePageChange,
              }}
              empty={empty}
              loading={loading}
            />
          </div>
        </div>
      </LocaleProvider>
    </>
  );
}

export default withAuth(Statistical01, "manager");
