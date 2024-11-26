import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const isAdmin = currentUser?.roles?.some(role => role.name === 'ROLE_ADMIN');

  if (!isAdmin) {
    // Nếu không phải admin, chuyển hướng về trang khác (ví dụ: trang chủ)
    return <Navigate to="/" />;
  }

  return children;
};
export default ProtectedRoute;
