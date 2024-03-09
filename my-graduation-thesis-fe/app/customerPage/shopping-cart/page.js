"use client";
import React from "react";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { Empty, Notification } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, deleteItemFromCart } = useCart();
  const handleIncreaseQty = (id, quantity, stock) => {
    if (quantity < stock) {
      increaseQty(id);
    } else {
      Notification.warning({
        title: "Quantity",
        content: "Quantity can not be greater than stock",
        with: 3,
      });
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        {cartItems.length === 0 ? (
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
              <Empty
                image={
                  <IllustrationNoResult style={{ width: 150, height: 150 }} />
                }
                darkModeImage={
                  <IllustrationNoResultDark
                    style={{ width: 150, height: 150 }}
                  />
                }
                description={
                  <p className="font-semibold text-2xl">Cart Empty</p>
                }
                className="p-6 pb-1"
              />
            </div>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id}>
                <div className="flex flex-wrap lg:flex-row gap-5  mb-4">
                  <div className="w-full lg:w-2/5 xl:w-2/4">
                    <figure className="flex leading-5 items-center">
                      <div>
                        <div className="block w-16 h-16 rounded border border-gray-200 overflow-hidden">
                          <img src={item.thumbnailImage} alt={item.name} />
                        </div>
                      </div>
                      <figcaption className="ml-3">
                        <p>
                          <a href="#" className="hover:text-blue-600">
                            {item.name}
                          </a>
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="w-24">
                    <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                      <button
                        data-action="decrement"
                        className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                        onClick={() => decreaseQty(item.id)}
                      >
                        <span className="m-auto text-2xl font-thin">−</span>
                      </button>
                      <input
                        type="number"
                        className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-900 custom-input-number"
                        name="custom-input-number"
                        value={item.quantity}
                        readOnly
                      ></input>
                      <button
                        data-action="increment"
                        className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                        onClick={() =>
                          handleIncreaseQty(item.id, item.quantity, item.stock)
                        }
                      >
                        <span className="m-auto text-2xl font-thin">+</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="leading-5">
                      <p className="font-semibold not-italic">
                        {" "}
                        ${item.price * item.quantity.toFixed(2)}
                      </p>
                      <small className="text-gray-400">
                        {" "}
                        ${item.price} / per item{" "}
                      </small>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <div className="float-right">
                      <a
                        className="px-4 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                        onClick={() => deleteItemFromCart(item.id)}
                      >
                        Remove
                      </a>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />
              </div>
            ))}

            <aside className="md:w-1/4">
              <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                <ul className="mb-5">
                  <li className="flex justify-between text-gray-600  mb-1">
                    <span>Amount before Tax:</span>
                  </li>
                  <li className="flex justify-between text-gray-600  mb-1">
                    <span>Total Units:</span>
                    <span className="text-green-500">(Units)</span>
                  </li>
                  <li className="flex justify-between text-gray-600  mb-1">
                    <span>TAX:</span>
                  </li>
                  <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
                    <span>Total price:</span>
                  </li>
                </ul>

                <a className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer">
                  Continue
                </a>

                <Link
                  href="/customerPage/product/product-list"
                  className="px-4 py-3 inline-block text-lg w-full text-center font-medium text-green-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100"
                >
                  Back to shop
                </Link>
              </article>
            </aside>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
