import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

const ProtectedRoute = ({ roles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (!isAuthenticated()) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    router.push("/login");
    return null;
  }

  if (roles && !roles.some((role) => user.roles.includes(role))) {
    // Nếu người dùng không có quyền truy cập, chuyển hướng về trang không có quyền
    router.push("/unauthorized");
    return null;
  }

  return children;
};

export default ProtectedRoute;
