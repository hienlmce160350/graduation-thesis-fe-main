"use client";
import React, { useState, useEffect } from "react";
import { List, Avatar, Spin, Button } from "@douyinfe/semi-ui";
import InfiniteScroll from "react-infinite-scroller";

const ScrollLoad = () => {
  const count = 8;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [countValue, setCountValue] = useState(0);

  const fetchData = () => {
    setLoading(true);
    return new Promise((res) => {
      setTimeout(() => {
        let dataSource = data.slice(
          countValue * count,
          countValue * count + count
        );
        res(dataSource);
      }, 1000);
    }).then((dataSource) => {
      let newData = [...data, ...dataSource];
      setCountValue(countValue + 1);
      setData(newData);
      setHasMore(!dataSource.length);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []); // componentDidMount equivalent

  const showLoadMore = countValue % 4 === 0;

  const loadMore =
    !loading && hasMore && showLoadMore ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={fetchData}>show more</Button>
      </div>
    ) : null;

  return (
    <div
      className="light-scrollbar"
      style={{
        height: 420,
        overflow: "auto",
        border: "1px solid var(--semi-color-border)",
        padding: 10,
      }}
    >
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        threshold={20}
        loadMore={fetchData}
        hasMore={!loading && hasMore && !showLoadMore}
        useWindow={false}
      >
        <List
          loadMore={loadMore}
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              header={<Avatar color={item.color}>SE</Avatar>}
              main={
                <div>
                  <span
                    style={{
                      color: "var(--semi-color-text-0)",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                  <p
                    style={{
                      color: "var(--semi-color-text-2)",
                      margin: "4px 0",
                    }}
                  >
                    Create a consistent, good-looking, easy-to-use, and
                    efficient user experience with a user-centric,
                    content-first, and human-friendly design system
                  </p>
                </div>
              }
            />
          )}
        />
        {loading && hasMore && (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default ScrollLoad;
