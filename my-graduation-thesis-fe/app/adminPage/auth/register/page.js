"use client";
import styles from "./RegisterScreen.module.css";
import { Input } from "@douyinfe/semi-ui";
import { MdEmail } from "react-icons/md";
import { Checkbox } from "@douyinfe/semi-ui";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
export default function Login() {
  const onButtonContainerClick = () => {
    alert("Hello");
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
        <form className={styles.form}>
          <div className="contain grid grid-cols-2 gap-6">
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>First Name</b>
                <Input
                  placeholder="abc"
                  suffix={<FaPenSquare className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Last Name</b>
                <Input
                  placeholder="abc"
                  suffix={<FaPenSquare className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Date of Birth</b>
                <Input
                  placeholder="yyyy-mm-dd"
                  suffix={<FaRegCalendarAlt className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Email</b>
                <Input
                  placeholder="name@gmail.com"
                  suffix={<MdEmail className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Phone Number</b>
                <Input
                  placeholder="0900******"
                  suffix={<MdEmail className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Username</b>
                <Input
                  placeholder="username"
                  suffix={<FaUser className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input>
              </div>
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Password</b>
                  <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  ></Input>
                </div>
              </div>
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Confirm Password</b>
                  <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  ></Input>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.button} onClick={() => onButtonContainerClick}>
            <button className={styles.children1}>
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
