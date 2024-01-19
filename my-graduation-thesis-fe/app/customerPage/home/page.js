"use client";
import React from "react";
import { Carousel } from "@douyinfe/semi-ui";
import { Card } from "@douyinfe/semi-ui";

const CusHome = () => {
  const { Meta } = Card;
  const style = {
    width: "100%",
    height: "600px",
  };

  const imgList = [
    "/staticImage/carousel1.jpg",
    "/staticImage/carousel2.jpg",
    "/staticImage/carousel3.jpg",
    "/staticImage/carousel4.jpg",
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel style={style} theme="light" arrowType="hover">
          {imgList.map((src, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${src})`,
                }}
              ></div>
            );
          })}
        </Carousel>
        <div className="my-8 flex items-center content-center justify-between">
          <div>
            <h2 className="text-4xl font-bold">Feature Product</h2>
          </div>
          <div className="">
            <a className="flex items-center gap-1 hover:text-gray-600" href="/">
              <h4>View all product</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="14"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#000000"
                  d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="buttonGradient w-full rounded-lg">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title={
                <a href="/" className="">
                  Product Name
                </a>
              }
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="buttonGradient w-full rounded-lg">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title={
                <a href="/" className="">
                  Product Name
                </a>
              }
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="buttonGradient w-full rounded-lg">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title={
                <a href="/" className="">
                  Product Name
                </a>
              }
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="buttonGradient w-full rounded-lg">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title={
                <a href="/" className="">
                  Product Name
                </a>
              }
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
        </div>

        <img src="/staticImage/section.png" />
        <img src="/staticImage/section3.png" />
        <img src="/staticImage/section4.png" />
      </div>
      {/* end of navbar */}
      {/* begin footer */}
      {/* end of footer */}
    </>
  );
};
export default CusHome;
