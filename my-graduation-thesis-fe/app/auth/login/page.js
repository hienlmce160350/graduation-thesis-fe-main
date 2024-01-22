"use client";
import styles from "./LoginScreen.module.css";
import { Checkbox } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Notification } from "@douyinfe/semi-ui";

import { AuthProvider, useAuth } from "../../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  // Start show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [rememberChecked, setRememberChecked] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  // End show/hide password
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Login could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Login Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Username can't be empty"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      // const response = await fetch(
      //   `https://ersadminapi.azurewebsites.net/api/Users/authenticate`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(values),
      //   }
      // );

      console.log("Values Login: " + JSON.stringify(values));

      await login(values);

      //   if (response.ok) {
      //     const data = await response.json();
      //     console.log("Login successful. Response:", data);
      //     Notification.success(successMess);
      //     let userId = data.id;
      //     let token = data.resultObj;

      //     Cookies.set("userId", userId, { expires: 1 });
      //     Cookies.set("token", token, { expires: 1 });
      //     router.push("/");
      //   } else {
      //     if (response.message == "Tài khoản đã bị khóa"){
      //       errorMess = {
      //         title: "Error",
      //         content: "Account has been locked.",
      //         duration: 3,
      //         theme: "light",
      //       };
      //     }
      //     Notification.error(errorMess);
      //     console.log("Failed to login system:", response);
      //   }
      // } catch (error) {
      //   console.error("Error login system:", error);
      // }
    },
  });

  const handleRememberClick = () => {
    // Khi click vào văn bản "Remember me", thay đổi giá trị của checkbox
    setRememberChecked(!rememberChecked);
    // Cập nhật giá trị của trường trong formik
    formik.setFieldValue("rememberMe", !rememberChecked);
  };

  return (
    <div className={styles.main}>
      <div className={styles.login}>
        <div className={styles.component66}>
          <div className={styles.logo}>
            <div className={styles.logo1}>
              <img
                className={styles.image2Icon}
                alt=""
                src="/staticImage/logoShop.png"
              />
            </div>
          </div>
          <div className={styles.header}>
            <b className={styles.title}>EatRightify System</b>
            <div className={styles.text}>Welcome</div>
          </div>
        </div>

        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.details}>
            <div className={styles.emailButton}>
              <b className={styles.email}>Username</b>
              <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                <input
                  name="userName"
                  id="userName"
                  type="text"
                  placeholder="Username"
                  className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userName}
                />
                <FaUser className="text-[24px]" />
              </div>
              {formik.touched.userName && formik.errors.userName ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.userName}
                </div>
              ) : null}
            </div>
            <div className={styles.pswd}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Password</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {showPassword ? (
                    <FaRegEyeSlash onClick={handleTogglePassword} />
                  ) : (
                    <FaRegEye onClick={handleTogglePassword} />
                  )}
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
              <div className={styles.checkboxParent}>
                <div className={styles.checkbox}>
                  <div className={styles.checkboxContent}>
                    <div
                      className={styles.children}
                      onClick={handleRememberClick}
                    >
                      {/* <Checkbox
                        name="rememberMe"
                        id="rememberMe"
                        aria-label="Remember"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rememberMe}
                      >
                        Remember me
                      </Checkbox> */}

                      {/* <input
                        className="w-4 h-4 rounded-[3px] bg-transparent cursor-pointer hover:border-[#41cd59]"
                        name="rememberMe"
                        id="rememberMe"
                        type="checkbox"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.rememberMe} // Sử dụng giá trị từ formik
                      />
                      <p className="ml-2 text-sm cursor-pointer">Remember me</p> */}

                      <input
                        className="w-4 h-4 rounded-[3px] bg-transparent cursor-pointer hover:border-[#41cd59]"
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        value={formik.values.rememberMe}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label
                        for="rememberMe"
                        className="ml-2 text-sm cursor-pointer"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.forgetPasswprd}>
                  <a href="/auth/forgot" className={styles.forgetPassword}>
                    Forget password?
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.button}>
            <button className={styles.children1} type="submit">
              <b className={styles.label2}>Login</b>
            </button>
          </div>
          <div className="text-sm w-full flex justify-center mt-4">
            Don’t have an account? &nbsp;
            <a href="/auth/register" className="font-bold hover:opacity-80">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrap your Login component with AuthProvider
const LoginWithAuthProvider = () => (
  <AuthProvider>
    <Login />
  </AuthProvider>
);

export default LoginWithAuthProvider;
