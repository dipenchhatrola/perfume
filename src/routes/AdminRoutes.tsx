import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../admin/pages/AdminDashboard";
import Orders from "../admin/pages/AdminOrders";
import Products from "../admin/pages/AdminProducts";
import Users from "../admin/pages/AdminUsers";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminRegister from "../admin/pages/AdminRegister";
import AdminProtectedRoute from "../admin/components/AdminProtectedRoute";
import AdminLayout from "../admin/components/AdminLayout";
import { AdminAuthProvider } from "context/AdminAuthContext";

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="login" element={<AdminLogin />} />
        <Route path="register" element={<AdminRegister />} />

        {/* 🔐 PROTECTED ROUTES */}
        {/* Wrap all protected routes in a single AdminLayout */}
        <Route
          path="/"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          {/* Index route - defaults to dashboard when /admin is accessed */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          
          {/* Catch-all route for admin section */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* DEFAULT REDIRECT for non-matching routes */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}
