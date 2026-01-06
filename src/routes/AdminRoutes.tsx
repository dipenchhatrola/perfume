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
        <Route
          path="dashboard"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="products"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="users"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        {/* DEFAULT REDIRECT */}
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}