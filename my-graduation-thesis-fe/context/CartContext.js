"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const addToCart = (product, quantity) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    const productInStock = product.stock;

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      const newQuantity =
        updatedCartItems[existingItemIndex].quantity + quantity;

      if (newQuantity > productInStock) {
        // Nếu số lượng trong giỏ hàng vượt quá số lượng trong kho hàng
        updatedCartItems[existingItemIndex].quantity = productInStock;
      } else {
        updatedCartItems[existingItemIndex].quantity += quantity;
      }

      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Lưu giỏ hàng vào localStorage ngay sau khi cập nhật
    } else {
      const updatedCartItems = [...cartItems, { ...product, quantity }];

      if (quantity > productInStock) {
        // Nếu số lượng muốn thêm vào giỏ hàng vượt quá số lượng trong kho hàng
        updatedCartItems[updatedCartItems.length - 1].quantity = productInStock;
      }

      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Lưu giỏ hàng vào localStorage ngay sau khi cập nhật
    }
  };
  const increaseQty = (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const decreaseQty = (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const deleteItemFromCart = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const value = {
    cartItems,
    setCartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    deleteItemFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
