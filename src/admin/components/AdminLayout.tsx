import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🔒 Protect admin routes
  if (!admin) {
    navigate("/admin/login");
    return null;
  }

  const handleSidebarToggle = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-72' : 'md:ml-20'
        }`}
      >
        <AdminNavbar
          admin={admin}
          notificationsCount={3}
          onLogout={() => {
            adminLogout();
            navigate("/admin/login");
          }}
          onSearch={(value) => console.log("Search:", value)}
          onNotificationClick={() => console.log("Notification clicked")}
          onProfileClick={() => navigate("/admin/profile")}
        />

        {/* Main Content with proper scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;