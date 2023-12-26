"use client";
import styles from "./UserCreateScreen.module.css";
import { Input } from "@douyinfe/semi-ui";
import { MdEmail } from "react-icons/md";
import { Checkbox } from "@douyinfe/semi-ui";
export default function UserCreate() {
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
          <div className={styles.details}>
            <div className={styles.emailButton}>
              <b className={styles.email}>Email</b>
              <Input
                placeholder="name@gmail.com"
                suffix={<MdEmail />}
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
          <div className={styles.button} onClick={() => onButtonContainerClick}>
            <button className={styles.children1}>
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
