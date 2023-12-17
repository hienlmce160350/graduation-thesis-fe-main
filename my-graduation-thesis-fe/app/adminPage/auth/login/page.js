"use client";
import styles from "./LoginScreen.module.css";
import { Input } from "@douyinfe/semi-ui";
import { Button } from "@douyinfe/semi-ui";
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
              <img className={styles.image2Icon} alt="" src="/image-2@2x.png" />
            </div>
          </div>
          <div className={styles.header}>
            <b className={styles.title}>EatRightify System</b>
            <div className={styles.text}>Welcome</div>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.details}>
            <div className={styles.emailButton}>
              <b className={styles.email}>Email</b>
              <div className={styles.box}>
                <div className={styles.text1}>
                  <div className={styles.abcgmailcom}>abc@gmail.com</div>
                  <img
                    className={styles.groupIcon}
                    alt=""
                    src="/group@2x.png"
                  />
                </div>
              </div>
            </div>
            <div className={styles.pswd}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Password</b>
                <Input mode="password" defaultValue="123456"></Input>
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
                      <div className={styles.label2}>Remember Me</div>
                    </div>
                  </div>
                </div>
                <div className={styles.forgetPasswprd}>
                  <div className={styles.forgetPassword}>Forget password?</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.button} onClick={() => onButtonContainerClick}>
            <button className={styles.children1}>
              <b className={styles.label2}>Login</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
