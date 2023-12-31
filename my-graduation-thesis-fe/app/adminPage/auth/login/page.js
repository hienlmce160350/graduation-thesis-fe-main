"use client";
import styles from "./LoginScreen.module.css";
import { Checkbox } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { MdEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Notification } from "@douyinfe/semi-ui";

export default function Login() {
  // Start show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

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
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `https://ersadminapi.azurewebsites.net/api/Users/authenticate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful. Response:", data);
          Notification.success(successMess);
          let userId = data.id;
          let token = data.resultObj;

          Cookies.set("userId", userId, { expires: 1 });
          Cookies.set("token", token, { expires: 1 });
          router.push("/");
        } else {
          if (response.message == "Tài khoản đã bị khóa"){
            errorMess = {
              title: "Error",
              content: "Account has been locked.",
              duration: 3,
              theme: "light",
            };
          }
          Notification.error(errorMess);
          console.log("Failed to login system:", response);
        }
      } catch (error) {
        console.error("Error login system:", error);
      }
    },
  });
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
              <b className={styles.email}>Email</b>
              {/* <Input
                  placeholder="name@gmail.com"
                  suffix={<MdEmail />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  name="userName"
                  id="userName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userName}
                ></Input> */}
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
                <MdEmail />
              </div>
            </div>
            <div className={styles.pswd}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Password</b>
                {/* <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                    name="password"
                    id="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  ></Input> */}
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
              </div>
              <div className={styles.checkboxParent}>
                <div className={styles.checkbox}>
                  <div className={styles.checkboxInner}>
                    <div className={styles.checkboxInput}>
                      <div className={styles.label1}>on</div>
                    </div>
                    <div className={styles.checkboxInnerDisplay} />
                  </div>
                  <div className={styles.checkboxContent}>
                    <div className={styles.children}>
                      <Checkbox
                        aria-label="Remember"
                        onChange={(e) => console.log(e)}
                      >
                        Remember me
                      </Checkbox>
                    </div>
                  </div>
                </div>
                <div className={styles.forgetPasswprd}>
                  <a href="#" className={styles.forgetPassword}>
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
            <a
              href="/adminPage/auth/register"
              className="font-bold hover:opacity-80"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
