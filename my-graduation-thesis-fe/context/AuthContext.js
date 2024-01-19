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

  let successMess = {
    title: "Success",
    content: "Login Successfully.",
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
    try {
      let id = Notification.info(loadingMess);
      setIds([...ids, id]);
      console.log("Data Login: " + JSON.stringify(credentials));
      // Gửi yêu cầu đăng nhập API và nhận token, userId, roles
      const response = await fetch(
        "https://ersadminapi.azurewebsites.net/api/Users/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      let idsTmp = [...ids];
      if (response.ok) {
        const data = await response.json();
        let userId = data.id;
        let token = data.resultObj;
        Cookies.set("token", token);
        Cookies.set("userId", userId);
        // const responseUser = await fetch(
        //   `https://ersadminapi.azurewebsites.net/api/Users/${userId}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`, // Thêm Bearer Token vào headers
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        // const dataUser = await responseUser.json();
        // console.log("Data User: " + JSON.stringify(dataUser));
        // console.log("Roles: " + dataUser.resultObj.roles);
        // let roles = dataUser.resultObj.roles;
        // Cookies.set("roles", roles);

        // setUser({ token, userId, roles });
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
        Notification.success(successMess);
        router.push("/");
      } else {
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
        Notification.error(errorMess);
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const forgot = async (credentials) => {
    try {
      let id = Notification.info(loadingMess);
      setIds([...ids, id]);
      console.log("Data Login: " + JSON.stringify(credentials));
      // Gửi yêu cầu đăng nhập API và nhận token, userId, roles
      const response = await fetch(
        `https://ersadminapi.azurewebsites.net/api/Users/ForgotPassword/${credentials.email}`,
        {
          method: "POST",
        }
      );
      let idsTmp = [...ids];
      if (response.ok) {
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
        Notification.success(successMess);
        router.push("/auth/reset");
      } else {
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
        Notification.error(errorMess);
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const reset = async (credentials) => {
    try {
      let id = Notification.info(loadingMess);
      setIds([...ids, id]);
      console.log("Data Reset: " + JSON.stringify(credentials));

      const { email, token, newPassword, confirmPassword } = credentials;

      // Tạo query string từ các thuộc tính của credentials
      const queryString = `?email=${encodeURIComponent(
        email
      )}&token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(
        newPassword
      )}&confirmPassword=${encodeURIComponent(confirmPassword)}`;
      // Gửi yêu cầu đăng nhập API và nhận token, userId, roles
      const response = await fetch(
        `https://ersadminapi.azurewebsites.net/api/Users/ResetPassword${queryString}`,
        {
          method: "POST",
        }
      );
      let idsTmp = [...ids];
      if (response.ok) {
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
        Notification.success(successMess);
        router.push("/auth/login");
      } else {
        Notification.close(idsTmp.shift());
        setIds(idsTmp);
        Notification.error(errorMess);
        console.error("Reset failed");
      }
    } catch (error) {
      console.error("Error during reset", error);
    }
  };

  const logout = () => {
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
      value={{ user, login, logout, forgot, reset, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
