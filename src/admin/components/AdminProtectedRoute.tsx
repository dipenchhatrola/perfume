import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const AdminProtectedRoute = ({ children }: Props) => {
  const isAdminLoggedIn = localStorage.getItem("adminToken");

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
