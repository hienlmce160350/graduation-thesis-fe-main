// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import { MdLogin } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FaStoreAlt } from "react-icons/fa";
import { CustomerNavigation, ManagerNavigation } from "@/libs/navSetting";
import { parseJwt } from "@/libs/commonFunction";
import { FaRobot } from "react-icons/fa6";

const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [ids, setIds] = useState([]);
  const [user, setUser] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Authorize
  const [menuSetting, setMenuSetting] = useState([]);
  const [role, setRole] = useState("");

  const signInItem = {
    type: "item",
    itemKey: "signin",
    text: "Sign in",
    icon: <MdLogin className="text-xl icon-nav" />,
    link: "/auth/login",
  };

  const signUpItem = {
    type: "item",
    itemKey: "signup",
    text: "Sign up",
    icon: <IoPersonAddSharp className="text-xl icon-nav" />,
    link: "/auth/register",
  };

  const storePage = {
    type: "item",
    itemKey: "store",
    text: "Store",
    icon: <FaStoreAlt className="text-xl icon-nav" />,
    link: "/customerPage",
    className: "!font-semibold hover:bg-gray-100",
  };

  const logoutItem = {
    type: "item",
    itemKey: "logout",
    text: "Logout",
    icon: <TbLogout className="text-red-600 icon-nav" />,
    click: () => logout(),
  };

  const updateMenuSetting = (role) => {
    switch (role) {
      case "admin":
        setMenuSetting([
          {
            type: "sub",
            itemKey: "user",
            text: "User Management",
            icon: <FaUsers className="text-xl icon-nav" />,
            items: [
              {
                type: "item",
                itemKey: "user-list",
                text: "List",
                link: "/adminPage/user/user-list",
                icon: (
                  <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />
                ),
              },
              {
                type: "item",
                itemKey: "user-create",
                text: "Create",
                link: "/adminPage/user/user-create",
                icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
              },
            ],
          },
          storePage,
          logoutItem,
        ]);
        break;
      case "verifier":
        setMenuSetting([
          {
            type: "item",
            icon: <FaRobot className="w-5 h-5 p-0 icon-nav" />,
            itemKey: "result",
            text: "Result Management",
            link: `/verifierPage/result/result-list`,
            className: "!font-semibold hover:bg-gray-100",
          },
          storePage,
          logoutItem,
        ]);
        break;
      case "manager":
        setMenuSetting([...ManagerNavigation, storePage, logoutItem]);
        break;
      case "manager;admin":
        setMenuSetting([
          ...ManagerNavigation,
          {
            type: "sub",
            itemKey: "user",
            text: "User Management",
            icon: <FaUsers className="w-5 h-5 p-0 icon-nav" />,
            items: [
              {
                type: "item",
                itemKey: "user-list",
                text: "List",
                link: "/adminPage/user/user-list",
                icon: (
                  <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />
                ),
              },
              {
                type: "item",
                itemKey: "user-create",
                text: "Create",
                link: "/adminPage/user/user-create",
                icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
              },
            ],
          },
          storePage,
          logoutItem,
        ]);
        break;
      case "manager;verifier":
        setMenuSetting([
          ...ManagerNavigation,
          {
            type: "item",
            icon: <FaRobot className="w-5 h-5 p-0 icon-nav" />,
            itemKey: "result",
            text: "Result Management",
            link: `/verifierPage/result/result-list`,
            className: "!font-semibold hover:bg-gray-100",
          },
          storePage,
          logoutItem,
        ]);
        break;
      case "admin;verifier":
        setMenuSetting([
          {
            type: "sub",
            itemKey: "user",
            text: "User Management",
            icon: <FaUsers className="w-5 h-full p-0 icon-nav" />,
            items: [
              {
                type: "item",
                itemKey: "user-list",
                text: "List",
                link: "/adminPage/user/user-list",
                icon: (
                  <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />
                ),
              },
              {
                type: "item",
                itemKey: "user-create",
                text: "Create",
                link: "/adminPage/user/user-create",
                icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
              },
            ],
          },
          {
            type: "item",
            icon: <FaRobot className="w-5 h-5 p-0 icon-nav" />,
            itemKey: "result",
            text: "Result Management",
            link: `/verifierPage/result/result-list`,
            className: "!font-semibold hover:bg-gray-100",
          },
          storePage,
          logoutItem,
        ]);
        break;
      case "manager;admin;verifier":
        setMenuSetting([
          ...ManagerNavigation,
          {
            type: "sub",
            itemKey: "user",
            text: "User Management",
            icon: <FaUsers className="w-5 h-5 p-0 icon-nav" />,
            items: [
              {
                type: "item",
                itemKey: "user-list",
                text: "List",
                link: "/adminPage/user/user-list",
                icon: (
                  <FaClipboardList className="w-5 p-0 ml-4 h-full icon-nav" />
                ),
              },
              {
                type: "item",
                itemKey: "user-create",
                text: "Create",
                link: "/adminPage/user/user-create",
                icon: <FaFolderPlus className="w-5 p-0 ml-4 h-full icon-nav" />,
              },
            ],
          },
          {
            type: "item",
            icon: <FaRobot className="w-5 h-5 p-0 icon-nav" />,
            itemKey: "result",
            text: "Result Management",
            link: `/verifierPage/result/result-list`,
            className: "!font-semibold hover:bg-gray-100",
          },
          storePage,
          logoutItem,
        ]);
        break;
      case "":
        setMenuSetting([...CustomerNavigation, logoutItem]);
        break;
      default:
        setMenuSetting([signUpItem, signInItem]);
        break;
    }
  };
  // End Authorize

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

  let accountBanErrorMess = {
    title: "Error",
    content: "This account has been banned. Please login other account.",
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
    content: "Wrong username or password. Please try again.",
    duration: 3,
    theme: "light",
  };

  let accountErrorMess = {
    title: "Error",
    content: "Account already exists. Please try again.",
    duration: 3,
    theme: "light",
  };

  let accountRegisterErrorMess = {
    title: "Error",
    content: "Register account could not be proceed. Please try again.",
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

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");
      setMenuSetting([signInItem, signUpItem]);
      if (token) {
        fetch(`https://erscus.azurewebsites.net/api/Users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Log the response data to the console
            setUser(data.resultObj);

            let roles =
              parseJwt(token)[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ];
            setRole(roles);
            updateMenuSetting(roles);
            // Handle the response data as needed
            if (data.isSuccessed) {
              // Success logic
            } else {
              // Failure logic
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle errors
          });
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const handleLogin = (token, userId) => {
    fetch(`https://erscus.azurewebsites.net/api/Users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.resultObj);
        let roles =
          parseJwt(token)[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setRole(roles);
        updateMenuSetting(roles);
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
        } else {
          // Failure logic
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const login = async (credentials) => {
    setLoading(true);
    fetch("https://ersadmin.azurewebsites.net/api/Users/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Log the response data to the console
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          let userId = data.id;
          let token = data.resultObj;
          Cookies.set("token", token);
          Cookies.set("userId", userId);
          handleLogin(token, userId);
          let expirationTime = parseJwt(token)["exp"];
          console.log("TokenExpired Time: ", expirationTime);
          // Get current time in Unix timestamp
          const currentTime = Math.floor(Date.now() / 1000);
          console.log("Current Time: ", currentTime);
          if (token != null) {
            executeAfterDelay(refreshToken, 1500);
          }
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(successMess);
          setUser(data.resultObj);
          let roles =
            parseJwt(token)[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          setRole(roles);
          updateMenuSetting(roles);
          if (roles == "") {
            router.push("/customerPage");
          } else if (roles.includes("manager")) {
            router.push("/managerPage");
          } else if (roles.includes("admin") && !roles.includes("manager")) {
            router.push("/adminPage");
          } else if (
            !roles.includes("admin") &&
            !roles.includes("manager") &&
            roles.includes("verifier")
          ) {
            router.push("/verifierPage");
          }
          setLoading(false);
        } else {
          setLoading(false);
          // Failure logic
          if (data.message == "Account is not exist") {
            Notification.error(accountExistErrorMess);
          } else if (data.message == "Wrong username or password") {
            Notification.error(loginIncorrectErrorMess);
          } else if (data.message == "Account is not verify") {
            Notification.error(accountVerifyErrorMess);
          } else if (data.message == "Account has been banned") {
            Notification.error(accountBanErrorMess);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
        // Handle errors
      });
  };

  const refreshToken = async () => {
    // Implement your refresh token logic here
    // This function should make a request to the server to refresh the token
    // For example:

    const token = Cookies.get("token");
    if (token == null) {
      return;
    }
    // Make a request to refresh the token
    const response = await fetch(
      `https://ersadmin.azurewebsites.net/api/Users/RefreshToken?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Refresh token successful
      const newToken = data.resultObj;
      const newId = data.id;
      Cookies.set("token", newToken);
      Cookies.set("userId", newId);
      console.log("Refresh token succesfully");
      if (newToken != null) {
        executeAfterDelay(refreshToken, 1500);
      }
    } else {
      // Handle refresh token failure
      throw new Error(data.message);
    }
  };

  const executeAfterDelay = (callback, delayInSeconds) => {
    const delayInMilliseconds = delayInSeconds * 1000; // Convert seconds to milliseconds
    setTimeout(callback, delayInMilliseconds);
  };

  const register = async (credentials) => {
    setLoading(true);
    fetch("https://ersadmin.azurewebsites.net/api/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          getVerifyCode(credentials.email);
          setLoading(false);
          Notification.success(registerSuccessMess);
        } else {
          // Failure logic
          if (data.message == "Email is exist") {
            Notification.error(emailErrorMess);
            setLoading(false);
          } else if (data.message == "Account is exist") {
            Notification.error(accountErrorMess);
            setLoading(false);
          } else if (data.message == "Register fail") {
            Notification.error(accountRegisterErrorMess);
            setLoading(false);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  const getVerifyCode = async (credentials) => {
    fetch(
      `https://ersadmin.azurewebsites.net/api/Users/GetVerifyCode/${credentials}`,
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
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Cookies.set("emailRegister", credentials);
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
      `https://ersadmin.azurewebsites.net/api/Users/ForgotPassword/${credentials}`,
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
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Cookies.set("emailForgot", credentials);
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
    fetch(`https://ersadmin.azurewebsites.net/api/Users/ResetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Cookies.remove("emailForgot");
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
    fetch(`https://ersadmin.azurewebsites.net/api/Users/VerifyAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Cookies.remove("emailRegister");
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
    setUser(null);
    setMenuSetting([signInItem, signUpItem]);
    router.push("/auth/login");
  };

  const isAuthenticated = async () => {
    return user?.token;
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
        menuSetting,
        isAuthenticated,
        hasRole,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
