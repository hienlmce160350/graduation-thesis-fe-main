"use client";
import React, { useEffect, useRef, useState } from "react";
import { default as VChart } from "@visactor/vchart";
import { Spin } from "@douyinfe/semi-ui";

const CONTAINER_ID = "chartContainer"; // ID của container div

const MyChartComponent = () => {
  const chartContainerRef = useRef(null);
  const initialized = useRef(false);

  // Chart
  const [loadingChartIncome, setLoadingChartIncome] = useState(false);
  const [loadingChartProduct, setLoadingChartProduct] = useState(false);

  const chart = async (formattedStartDate, formattedEndDate) => {
    setLoadingChartIncome(true);
    try {
      // Gọi API với các tham số startDate và endDate tương ứng
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Orders/GetTotalProfit?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Chuyển đổi response thành dạng JSON
      const data = await response.json();

      setLoadingChartIncome(false);
      return data;
    } catch (error) {
      console.error(`Error fetching data for month: ${error}`);
      setLoadingChartIncome(false);
    }
  };

  const chartProduct = async (formattedStartDate, formattedEndDate) => {
    setLoadingChartProduct(true);
    try {
      // Gọi API với các tham số startDate và endDate tương ứng
      const response = await fetch(
        `https://ersmanager.azurewebsites.net/api/Statistical/GetTotalQuantity?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Chuyển đổi response thành dạng JSON
      const data = await response.json();

      setLoadingChartProduct(false);
      return data;
    } catch (error) {
      console.error(`Error fetching data for month: ${error}`);
      setLoadingChartProduct(false);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      // Lặp qua từ tháng 1 đến tháng 12
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

      let newDataProfit = [];
      let newDataProduct = [];

      if (!loadingChartProduct && !loadingChartIncome) {
        const fetchData = async () => {
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

            const profitData = await chart(
              formattedStartDate,
              formattedEndDate
            );
            const productData = await chartProduct(
              formattedStartDate,
              formattedEndDate
            );

            newDataProfit.push({
              x: xLabels[month - 1],
              type: "profit",
              y: profitData,
            });
            newDataProduct.push({
              x: xLabels[month - 1],
              type: "product",
              y: productData,
            });
          }

          const spec = {
            type: "common",
            seriesField: "color",
            data: [
              {
                id: "id0",
                values: newDataProfit,
              },
              {
                id: "id1",
                values: newDataProduct,
              },
            ],
            series: [
              {
                type: "bar",
                id: "bar",
                dataIndex: 0,
                label: { visible: false },
                seriesField: "type",
                xField: ["x", "type"],
                yField: "y",
              },
              {
                type: "line",
                id: "line",
                dataIndex: 1,
                label: { visible: false },
                seriesField: "type",
                xField: "x",
                yField: "y",
                stack: false,
              },
            ],
            axes: [
              { orient: "left", seriesIndex: [0] },
              { orient: "right", seriesId: ["line"], grid: { visible: false } },
              { orient: "bottom", label: { visible: true }, type: "band" },
            ],
            legends: { visible: true, orient: "bottom" },
          };

          const chartContainer = chartContainerRef.current;
          const vchart = new VChart(spec, { dom: chartContainer });

          vchart.renderSync();

          // For debugging purposes
          window["vchart"] = vchart;
        };
        fetchData();
      }

      initialized.current = true;
    }
  }, []);
  return (
    <>
      {loadingChartProduct || loadingChartIncome ? <Spin /> : null}

      <div ref={chartContainerRef} id={CONTAINER_ID}></div>
    </>
  );
};

export default MyChartComponent;
