// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";

const AuthContext = createContext();
export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [ids, setIds] = useState([]);
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Login could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let emailErrorMess = {
    title: "Error",
    content: "Email already exists. Please try again.",
    duration: 3,
    theme: "light",
  };

  let emailNotFoundErrorMess = {
    title: "Error",
    content: "Email not found. Please try again.",
    duration: 3,
    theme: "light",
  };

  let verifyCodeErrorMess = {
    title: "Error",
    content: "Verify code not correct. Please try again.",
    duration: 3,
    theme: "light",
  };

  let resetPasswordCodeTimeErrorMess = {
    title: "Error",
    content: "Token has expired. Please get new code to  reset password.",
    duration: 3,
    theme: "light",
  };

  let resetPasswordCodeErrorMess = {
    title: "Error",
    content: "Password reset failed. Make sure your refesh code is correct.",
    duration: 3,
    theme: "light",
  };

  let accountVerifyErrorMess = {
    title: "Error",
    content: "Unverified account. Please verify account.",
    duration: 3,
    theme: "light",
  };

  let accountExistErrorMess = {
    title: "Error",
    content: "Account does not exist. Please try again.",
    duration: 3,
    theme: "light",
  };

  let loginIncorrectErrorMess = {
    title: "Error",
    content: "Password is incorrect. Please try again.",
    duration: 3,
    theme: "light",
  };

  let accountErrorMess = {
    title: "Error",
    content: "Account already exists. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Login Successfully.",
    duration: 3,
    theme: "light",
  };

  let registerSuccessMess = {
    title: "Success",
    content: "Register Successfully.",
    duration: 3,
    theme: "light",
  };

  let resetSuccessMess = {
    title: "Success",
    content: "Reset Password Successfully.",
    duration: 3,
    theme: "light",
  };

  let verifySuccessMess = {
    title: "Success",
    content: "Verify Account Successfully.",
    duration: 3,
    theme: "light",
  };

  let verifyAccountErrorMess = {
    title: "Error",
    content: "Verify Account could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let resetPasswordErrorMess = {
    title: "Error",
    content: "Reset password could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let getVerifyCodeErrorMess = {
    title: "Error",
    content: "Get Verify Code could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let forgotErrorMess = {
    title: "Error",
    content:
      "Get Token to reset password could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let getVerifyCodeSuccessMess = {
    title: "Success",
    content: "Get Verify Code Successfully.",
    duration: 3,
    theme: "light",
  };

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 0,
    theme: "light",
  };
  // End show notification
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    const roles = Cookies.get("roles");

    if (token && userId && roles) {
      setUser({ token, userId, roles: roles.split(",") });
    }
  }, []);

  const login = async (credentials) => {
    fetch("https://ersadminapi.azurewebsites.net/api/Users/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          let userId = data.id;
          let token = data.resultObj;
          Cookies.set("token", token);
          Cookies.set("userId", userId);

          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(successMess);
          router.push("/");
        } else {
          // Failure logic
          if (data.message == "Tài khoản không tồn tại") {
            Notification.error(accountExistErrorMess);
          } else if (data.message == "Đăng nhập không đúng") {
            Notification.error(loginIncorrectErrorMess);
          } else if (data.message == "Tài khoản chưa xác thực") {
            Notification.error(accountVerifyErrorMess);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const register = async (credentials) => {
    fetch("https://ersadminapi.azurewebsites.net/api/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          getVerifyCode(credentials.email);
          Notification.success(registerSuccessMess);
        } else {
          // Failure logic
          if (data.message == "Emai đã tồn tại") {
            Notification.error(emailErrorMess);
          } else if (data.message == "Tài khoản đã tồn tại") {
            Notification.error(accountErrorMess);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const getVerifyCode = async (credentials) => {
    fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/GetVerifyCode/${credentials}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(getVerifyCodeSuccessMess);
          router.push("/auth/verify");
        } else {
          // Failure logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          if (data.message == "Email not found") {
            Notification.error(emailNotFoundErrorMess);
          } else {
            Notification.error(getVerifyCodeErrorMess);
          }
          console.error("Get Verify Code failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const forgot = async (credentials) => {
    fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/ForgotPassword/${credentials}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(getVerifyCodeSuccessMess);
          router.push("/auth/reset");
        } else {
          // Failure logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          if (data.message == "Email not found") {
            Notification.error(emailNotFoundErrorMess);
          } else {
            Notification.error(forgotErrorMess);
          }
          console.error("Get Token to reset password failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const reset = async (credentials) => {
    const { email, token, newPassword, confirmPassword } = credentials;
    const queryString = `?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(
      newPassword
    )}&confirmPassword=${encodeURIComponent(confirmPassword)}`;
    fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/ResetPassword${queryString}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(resetSuccessMess);
          router.push("/auth/login");
        } else {
          // Failure logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          if (data.message == "Email not found") {
            Notification.error(emailNotFoundErrorMess);
          } else if (
            data.message ==
            "Password reset failed. Make sure your refesh code is correct"
          ) {
            Notification.error(resetPasswordCodeErrorMess);
          } else if (data.message == "Token has expired") {
            Notification.error(resetPasswordCodeTimeErrorMess);
          } else {
            Notification.error(resetPasswordErrorMess);
          }
          console.error("Reset Password failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const verify = async (credentials) => {
    const { email, code } = credentials;
    const queryString = `?email=${encodeURIComponent(
      email
    )}&code=${encodeURIComponent(code)}`;
    fetch(
      `https://ersadminapi.azurewebsites.net/api/Users/VerifyAccount${queryString}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(verifySuccessMess);
          router.push("/auth/login");
        } else {
          // Failure logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          if (data.message == "Email not found") {
            Notification.error(emailNotFoundErrorMess);
          } else if (data.message == "Verify code not correct") {
            Notification.error(verifyCodeErrorMess);
          } else {
            Notification.error(verifyAccountErrorMess);
          }
          console.error("Verify failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const logout = async () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("roles");
    setUser(null);
  };

  const isAuthenticated = async () => {
    return !!user?.token;
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        forgot,
        reset,
        verify,
        register,
        getVerifyCode,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
