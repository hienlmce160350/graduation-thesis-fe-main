"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { Empty, Notification } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, deleteItemFromCart, clearCart } =
    useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [totalPriceAfterDiscount, setTotalPriceAfterDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false); // State để xác định xem voucher đã được áp dụ
  const [vip, setVip] = useState(0);
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
  const calculateTotalProductPriceWithVip = (cartItems) => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      const discountedPrice = item.price * (1 - vip * 0.02); // Giảm giá theo VIP
      totalPrice += discountedPrice * item.quantity;
    });
    return totalPrice;
  };
  const calculateTotalProductPrice = (cartItems) => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };

  // Function to calculate total price after discount
  const calculateTotalPrice = (cartItems) => {
    const totalProductPrice = parseFloat(
      calculateTotalProductPriceWithVip(cartItems)
    );
    const discountAmount = (totalProductPrice * discountPercent) / 100;
    return totalProductPrice - discountAmount;
  };

  const handleSubmit = () => {
    // Kiểm tra xem discountCode có thay đổi không trước khi gọi lại fetchDiscountPercent
    if (discountCode !== "") {
      fetchDiscountPercent();
    } else {
      // Xử lý khi không có discountCode
      Notification.warning({
        title: "Discount Code",
        content: "Please enter a discount code",
        with: 3,
      });
    }
  };

  // Function to fetch discountPercent from API based on discountCode
  const fetchDiscountPercent = async () => {
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Promotions/${discountCode}`
      );
      if (response.ok) {
        const data = await response.json();
        setDiscountPercent(data.resultObj.discountPercent);
        const totalPrice = calculateTotalPrice(cartItems);
        setTotalPriceAfterDiscount(totalPrice);
        setVoucherApplied(true); // Đánh dấu rằng voucher đã được áp dụng
        console.log("discount voucher:", data.resultObj.discountPercent);
      } else {
        const responseData = await response.json(); // Parse response body as JSON

        // Handle invalid discount code
        setDiscountPercent(0);
        setTotalPriceAfterDiscount(0);
        console.log("Fetch Error:", responseData.message);
        Notification.error({
          title: "Error",
          content:
            responseData.message || "Voucher entry invalid. Please try again.",
          duration: 3,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error fetching discount percent:", error);
    }
  };

  const clearVoucher = () => {
    setDiscountPercent(0);
    setTotalPriceAfterDiscount(0);
    setDiscountCode("");
    setVoucherApplied(false); // Đánh dấu rằng voucher đã bị xóa
  };
  //xu ly vip
  const fetchVip = async () => {
    try {
      const userId = Cookies.get("userId");
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Vip:", data.resultObj.vip);
        setVip(data.resultObj.vip);
      } else {
        console.error("Failed to fetch VIP data");
      }
    } catch (error) {
      console.error("Error fetching VIP data:", error);
    }
  };
  // Validation schema for form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^0[1-9]\d{8,10}$/, "Phone is invalid")
      .required("Phone is required"),
  });
  //Form
  const formCreateOrder = useFormik({
    initialValues: {
      userId: "", // Thêm userId vào initialValues
      name: "", // Thêm name vào initialValues
      address: "", // Thêm address vào initialValues
      email: "", // Thêm email vào initialValues
      phoneNumber: "", // Thêm phoneNumber vào initialValues
      totalPriceOfOrder: 0, // Thêm totalPriceOfOrder vào initialValues
      orderDetails: [], // Thêm orderDetails vào initialValues
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Submitting form with values:", values);
        values.userId = Cookies.get("userId");
        values.totalPriceOfOrder = totalPriceAfterDiscount;
        const response = await fetch(
          `https://eatright2.azurewebsites.net/api/Orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        if (response.ok) {
          Notification.success({
            title: "Success",
            content: "Create Order Successfully.",
            duration: 5,
            theme: "light",
          });
          clearCart();
          // resetForm();
        } else {
          Notification.error({
            title: "Error",
            content: "Create Order could not be proceed. Please try again.",
            duration: 3,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        Notification.error({
          title: "Error",
          content: "An error occurred. Please try again.",
          duration: 3,
          theme: "light",
        });
      }
    },
  });
  const handleSubmitFormCreateOrder = () => {
    formCreateOrder.submitForm();
  };
  useEffect(() => {
    // Cập nhật giỏ hàng trước khi tính toán giảm giá
    // fetchDiscountPercent();
    const totalPrice = calculateTotalPrice(cartItems);
    setTotalPriceAfterDiscount(totalPrice);
    const bearerToken = Cookies.get("token");
    if (bearerToken) {
      fetchVip();
    }
    formCreateOrder.setValues((values) => ({
      ...values,
      orderDetails: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }));
  }, [cartItems, discountCode, discountPercent]); // Gọi lại useEffect khi cartItems thay đổi
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
            <div className="text-center mb-5">
              <Link href={"/customerPage/product/product-list"}>
                <button className="buttonGradient border rounded-lg w-48 lg:w-48 font-bold text-white mt-5">
                  Go Shopping
                </button>
              </Link>
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
                          <Link
                            href={`/customerPage/product/product-detail/${item.id}`}
                            className="hover:text-green-600"
                          >
                            {item.name}
                          </Link>
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
                        ${item.price * item.quantity}
                      </p>
                      <small className="text-gray-400">
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
            <div className="md:flex md:gap-2 mt-10 md:justify-between items-end">
              <div className="md:flex md:w-1/2 lg:w-1/3 md:flex-col p-2 border shadow-lg mb-5 rounded-md">
                <div className="text-white text-center mb-6 rounded-lg p-1 bg-[#69AD28]">
                  <h1 className="font-bold text-2xl">Ship Information</h1>
                </div>
                <form onSubmit={formCreateOrder.handleSubmit}>
                  <div className="mb-4">
                    <label
                      for="name"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input w-full rounded-md p-2 !border-2 border-solid !border-[#ACCC8B]"
                      value={formCreateOrder.values.name}
                      onBlur={formCreateOrder.handleBlur}
                      onChange={formCreateOrder.handleChange}
                    />
                    {formCreateOrder.errors.name &&
                      formCreateOrder.touched.name && (
                        <p className="text-red-500 mt-1">
                          {formCreateOrder.errors.name}
                        </p>
                      )}
                  </div>

                  <div className="mb-4">
                    <label
                      for="address"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-input w-full rounded-md p-2 !border-2 border-solid !border-[#ACCC8B]"
                      value={formCreateOrder.values.address}
                      onBlur={formCreateOrder.handleBlur}
                      onChange={formCreateOrder.handleChange}
                    />
                    {formCreateOrder.errors.name &&
                      formCreateOrder.touched.address && (
                        <p className="text-red-500 mt-1">
                          {formCreateOrder.errors.address}
                        </p>
                      )}
                  </div>

                  <div className="mb-4">
                    <label
                      for="email"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input w-full rounded-md p-2 !border-2 border-solid !border-[#ACCC8B]"
                      value={formCreateOrder.values.email}
                      onBlur={formCreateOrder.handleBlur}
                      onChange={formCreateOrder.handleChange}
                    />
                    {formCreateOrder.errors.name &&
                      formCreateOrder.touched.email && (
                        <p className="text-red-500 mt-1">
                          {formCreateOrder.errors.email}
                        </p>
                      )}
                  </div>

                  <div className="">
                    <label
                      for="phoneNumber"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="form-input w-full rounded-md p-2 !border-2 border-solid !border-[#ACCC8B]"
                      value={formCreateOrder.values.phoneNumber}
                      onBlur={formCreateOrder.handleBlur}
                      onChange={formCreateOrder.handleChange}
                    />
                    {formCreateOrder.errors.name &&
                      formCreateOrder.touched.phoneNumber && (
                        <p className="text-red-500 mt-1">
                          {formCreateOrder.errors.phoneNumber}
                        </p>
                      )}
                  </div>
                </form>
              </div>

              <aside className="md:w-1/2 lg:w-1/3">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                  <ul className="mb-5">
                    <li className="flex justify-between text-gray-600  mb-1">
                      <span>Total Product Price:</span>
                      <span>${calculateTotalProductPrice(cartItems)}</span>
                    </li>
                    <li className="flex justify-between text-gray-600  mb-1">
                      <span>Vip Discound:</span>
                      <span>{vip * 2}%</span>
                    </li>
                    <li className="flex justify-between text-gray-600  mb-1">
                      <span>Voucher Discound:</span>
                      <span>{discountPercent}%</span>
                    </li>
                    {/* Total price and discount display */}
                    <li className="flex justify-between">
                      <input
                        className="rounded border border-1 p-1"
                        name="voucher"
                        id="voucher"
                        placeholder="Enter your voucher..."
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                      />
                      {!voucherApplied ? (
                        <button
                          className="px-3 py-2 text-center font-medium text-white bg-[#69AD28] border border-transparent rounded-md hover:bg-green-700 cursor-pointer"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          className="px-3 py-2 text-center font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 cursor-pointer"
                          onClick={clearVoucher}
                        >
                          Clear Voucher
                        </button>
                      )}
                    </li>
                    {/* Total price display */}
                    <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
                      <span>Total Price:</span>
                      <span>
                        $
                        {discountPercent !== 0
                          ? totalPriceAfterDiscount
                          : calculateTotalProductPriceWithVip(
                              cartItems
                            ).toFixed(2)}
                      </span>
                    </li>
                  </ul>

                  <Link
                    href={"/"}
                    className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium text-white bg-[#69AD28] border border-transparent rounded-md hover:bg-green-700 cursor-pointer"
                  >
                    Pay By Card
                  </Link>
                  <button
                    onClick={handleSubmitFormCreateOrder}
                    className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium text-white bg-[#69AD28] border border-transparent rounded-md hover:bg-green-700 cursor-pointer"
                  >
                    Pay By Cash
                  </button>

                  <Link
                    href="/customerPage/product/product-list"
                    className="px-4 py-3 inline-block text-lg w-full text-center font-medium text-[#69AD28] bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100"
                  >
                    Back to shop
                  </Link>
                </article>
              </aside>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
