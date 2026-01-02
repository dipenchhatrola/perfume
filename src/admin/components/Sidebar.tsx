import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  PlusCircle, 
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  HelpCircle,
  TrendingUp,
  UserPlus
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Products", path: "/admin/products", icon: Package },
  // { name: "Add Product", path: "/admin/add-product", icon: PlusCircle },
  { name: "Users", path: "/admin/users", icon: Users },
];

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function Sidebar() {
  const location = useLocation();
  
  return (
    <>
      {/* Sidebar - Enhanced Design */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className="
          fixed
          top-0 left-0
          h-screen w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl flex flex-col z-30
          font-sans
        "
      >
        {/* Logo Section - Enhanced */}
        <div className="px-6 py-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            
            {/* Always visible title */}
            <div className="flex flex-col flex-1">
              <h2 className="text-xl font-bold text-white whitespace-nowrap tracking-tight">
                Admin
              </h2>
              <p className="text-xs text-gray-300 mt-0.5 whitespace-nowrap font-medium">
                Management Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Navigation Heading */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-4 font-mono">
            Main Navigation
          </p>
          
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-l-4 border-purple-400 text-white shadow-lg shadow-purple-500/10" 
                          : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg flex-shrink-0 shadow-md ${
                          isActive 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          <item.icon size={18} />
                        </div>
                        
                        <span className={`text-sm font-medium overflow-hidden whitespace-nowrap tracking-wide ${isActive ? "font-bold text-white" : "text-gray-300"}`}>
                          {item.name}
                        </span>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ rotate: -90 }}
                          animate={{ rotate: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight 
                            size={16} 
                            className="text-purple-300 flex-shrink-0" 
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Quick Stats Section - Enhanced */}
          <div className="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide">Quick Stats</h3>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-xl border border-gray-700 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <ShoppingCart size={14} className="text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-300">Today's Orders</p>
                </div>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-[10px] text-green-400 font-medium mt-1">↑ 12% from yesterday</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-xl border border-gray-700 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                    <UserPlus size={14} className="text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-300">New Users</p>
                </div>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-[10px] text-green-400 font-medium mt-1">↑ 8% from last week</p>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Bottom Section - Enhanced */}
        <div className="mt-auto space-y-4 p-4 border-t border-gray-700 bg-gradient-to-t from-gray-900 to-gray-800">
          {/* Notifications & Help */}
          <div className="flex items-center justify-between px-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700 shadow-md"
            >
              <Bell size={18} className="text-cyan-300" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg">
                3
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700 shadow-md"
            >
              <HelpCircle size={18} className="text-amber-300" />
            </motion.button>
            
            <Link 
              to="/admin/settings" 
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700 shadow-md"
              >
                <Settings size={18} className="text-emerald-300" />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}