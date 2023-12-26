"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Table, Avatar } from "@douyinfe/semi-ui";
import * as dateFns from "date-fns";

const figmaIconUrl =
  "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png";
const columns = [
  {
    title: "Title",
    dataIndex: "name",
    width: 400,
    render: (text, record, index) => {
      return (
        <div>
          <Avatar
            size="small"
            shape="square"
            src={figmaIconUrl}
            style={{ marginRight: 12 }}
          ></Avatar>
          {text}
        </div>
      );
    },
    filters: [
      {
        text: "Semi Design design draft",
        value: "Semi Design design draft",
      },
      {
        text: "Semi D2C design draft",
        value: "Semi D2C design draft",
      },
    ],
    onFilter: (value, record) => record.name.includes(value),
  },
  {
    title: "Size",
    dataIndex: "size",
    sorter: (a, b) => (a.size - b.size > 0 ? 1 : -1),
    render: (text) => `${text} KB`,
  },
  {
    title: "Owner",
    dataIndex: "owner",
    render: (text, record, index) => {
      return (
        <div>
          <Avatar
            size="small"
            color={record.avatarBg}
            style={{ marginRight: 4 }}
          >
            {typeof text === "string" && text.slice(0, 1)}
          </Avatar>
          {text}
        </div>
      );
    },
  },
  {
    title: "Update",
    dataIndex: "updateTime",
    sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
    render: (value) => {
      return dateFns.format(new Date(value), "yyyy-MM-dd");
    },
  },
];

const DAY = 24 * 60 * 60 * 1000;

export default function CategoryManagement() {
  const [dataSource, setData] = useState([]);

  const rowSelection = useMemo(
    () => ({
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === "Michael James", // Column configuration not to be checked
        name: record.name,
      }),
    }),
    []
  );
  const scroll = useMemo(() => ({ y: 300 }), []);

  const getData = () => {
    const data = [];
    for (let i = 0; i < 46; i++) {
      const isSemiDesign = i % 2 === 0;
      const randomNumber = (i * 1000) % 199;
      data.push({
        key: "" + i,
        name: isSemiDesign
          ? `Semi Design design draft${i}.fig`
          : `Semi D2C design draft${i}.fig`,
        owner: isSemiDesign ? "Jiang Pengzhi" : "Hao Xuan",
        size: randomNumber,
        updateTime: new Date().valueOf() + randomNumber * DAY,
        avatarBg: isSemiDesign ? "grey" : "red",
      });
    }
    return data;
  };

  useEffect(() => {
    const data = getData();
    setData(data);
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
      scroll={scroll}
    />
  );
}
