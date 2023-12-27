"use client";
import styles from "./RegisterScreen.module.css";
import { Input } from "@douyinfe/semi-ui";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";
export default function Login() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      phoneNumber: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Value: " + values);
      try {
        const response = await fetch(
          `https://ersadminapi.azurewebsites.net/api/Users`,
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

          let userId = data.id;
          let token = data.resultObj;

          Cookies.set("userId", userId, { expires: 1 });
          Cookies.set("token", token, { expires: 1 });
          router.push("/");
        } else {
          console.log("An error occurred:", response.status);
        }
      } catch (error) {
        console.error("An error occurred:", error);
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
          <div className="contain grid grid-cols-2 gap-6">
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>First Name</b>
                {/* <Input
                  placeholder="abc"
                  suffix={<FaPenSquare className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
                <input
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Last Name</b>
                {/* <Input
                  placeholder="abc"
                  suffix={<FaPenSquare className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}

                <input
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Date of Birth</b>
                {/* <Input
                  placeholder="yyyy-mm-dd"
                  suffix={<FaRegCalendarAlt className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
                <input
                  name="dob"
                  id="dob"
                  type="text"
                  placeholder="yyyy-mm-dd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dob}
                />
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Email</b>
                {/* <Input
                  placeholder="name@gmail.com"
                  suffix={<MdEmail className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}

                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Phone Number</b>
                {/* <Input
                  placeholder="0900******"
                  suffix={<MdEmail className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  type="text"
                  placeholder="0900******"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                />
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Username</b>
                {/* <Input
                  placeholder="username"
                  suffix={<FaUser className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
                <input
                  name="userName"
                  id="userName"
                  type="text"
                  placeholder="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  style={{ backgroundColor: "#DEE4FF" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userName}
                />
              </div>
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Password</b>
                  {/* <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  ></Input> */}
                  <input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    style={{ backgroundColor: "#DEE4FF" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </div>
              </div>
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Confirm Password</b>
                  {/* <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  ></Input> */}

                  <input
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    style={{ backgroundColor: "#DEE4FF" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.button}>
            <button className={styles.children1} type="submit">
              <b className={styles.label2}>Register</b>
            </button>
          </div>
          <div className="text-sm w-full flex justify-center mt-4">
            Already have an account? &nbsp;
            <a
              href="/adminPage/auth/login"
              className="font-bold hover:opacity-80"
            >
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
