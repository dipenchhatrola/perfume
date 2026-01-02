import { useState, useEffect, useCallback } from 'react';
import {
  User, Mail, Phone, Calendar, Search, Edit, Trash2,
  UserPlus, ChevronLeft, ChevronRight, Shield, CheckCircle,
  MoreVertical, Eye, Download, Filter, X, AlertCircle,
  TrendingUp, Users as UsersIcon, UserCheck, Clock, Sparkles,
  ArrowRight, Loader, Check, AlertTriangle,
  Key
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastLogin: string;
  avatarColor: string;
  username?: string;
  password?: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    loadUsersFromLocalStorage();
  }, []);

  const loadUsersFromLocalStorage = () => {
    try {
      const storedUsers = localStorage.getItem('perfume_users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);

        // Convert perfume_users format to UserData format
        const formattedUsers: UserData[] = parsedUsers.map((user: any, index: number) => {
          // Avatar colors array (same as before)
          const colors = [
            'bg-gradient-to-r from-blue-500 to-cyan-400',
            'bg-gradient-to-r from-purple-500 to-pink-400',
            'bg-gradient-to-r from-green-500 to-emerald-400',
            'bg-gradient-to-r from-orange-500 to-amber-400',
            'bg-gradient-to-r from-red-500 to-rose-400',
            'bg-gradient-to-r from-indigo-500 to-blue-400',
            'bg-gradient-to-r from-teal-500 to-cyan-400',
            'bg-gradient-to-r from-pink-500 to-rose-400',
          ];

          return {
            id: user.id || (index + 1).toString(),
            name: user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username || user.email,
            email: user.email || '',
            phone: user.phone || '+1 000 000 0000',
            role: 'user' as const, // Default role 'user'
            status: 'active' as const, // Default status 'active'
            registrationDate: user.joinDate || new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString().split('T')[0],
            avatarColor: colors[index % colors.length],
            username: user.username,
            password: user.password, // Note: In real app, never store password like this
          };
        });

        setUsers(formattedUsers);
      } else {
        // If no users in localStorage, use the default dummy data
        //const defaultUsers = [...]; // Your existing dummy data
        //setUsers(defaultUsers);
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      // Fallback to default data
      //const defaultUsers = [...]; // Your existing dummy data
      //setUsers(defaultUsers);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'admin' | 'user' | 'moderator',
  });
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Password display component
  const PasswordDisplay = ({ password }: { password?: string }) => {
    const [isVisible, setIsVisible] = useState(false);

    if (!password) return <span className="text-gray-400">No password</span>;

    return (
      <div className="flex items-center gap-2">
        <span className="font-mono">
          {isVisible ? password : '••••••••'}
        </span>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(password);
            // Show notification
          }}
          className="text-xs text-green-500 hover:text-green-700"
          title="Copy password"
        >
          Copy
        </button>
      </div>
    );
  };

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return 'N/A';

    // Check if already in MM/DD/YYYY format
    if (dateString.includes('/')) {
      return dateString;
    }

    // Check if in YYYY-MM-DD format
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
      }
    }

    return dateString;
  }, []);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddUser = () => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-cyan-400',
      'bg-gradient-to-r from-purple-500 to-pink-400',
      'bg-gradient-to-r from-green-500 to-emerald-400',
      'bg-gradient-to-r from-orange-500 to-amber-400',
      'bg-gradient-to-r from-red-500 to-rose-400',
      'bg-gradient-to-r from-indigo-500 to-blue-400',
    ];

    const userToAdd: UserData = {
      id: (users.length + 1).toString(),
      ...newUser,
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };

    setUsers([...users, userToAdd]);
    saveUsersToLocalStorage([...users, userToAdd]);
    setNewUser({ name: '', email: '', phone: '', role: 'user' });
    setShowAddModal(false);
    showNotificationMessage('User added successfully!');
  };

  const saveUsersToLocalStorage = (usersList: UserData[]) => {
    try {
      // Convert back to perfume_users format if needed
      const perfumeUsers = usersList.map(user => ({
        id: user.id,
        firstName: user.name.split(' ')[0] || user.name,
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        username: user.name,
        phone: user.phone,
        joinDate: user.registrationDate,
      }));

      localStorage.setItem('perfume_users', JSON.stringify(perfumeUsers));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? selectedUser : user
    );

    setUsers(updatedUsers);
    // Sync with localStorage
    saveUsersToLocalStorage(updatedUsers);

    setShowEditModal(false);
    setSelectedUser(null);
    showNotificationMessage('User updated successfully!');
  };

  const handleDeleteUser = async (id: string) => {
    setIsDeleting(id);
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);

    // Also update localStorage
    saveUsersToLocalStorage(updatedUsers);

    setIsDeleting(null);
    showNotificationMessage('User deleted successfully!');
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user
    ));
    showNotificationMessage(`User status updated to ${newStatus}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'inactive': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'suspended': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'moderator': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'user': return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    todayLogins: users.filter(u => u.lastLogin === new Date().toISOString().split('T')[0]).length,
    growth: '+12% this month',
  };

  // Get user initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const modalVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } }
  };

  const pageVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6"
    >
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <Check className="animate-pulse" size={20} />
              <span className="font-medium">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-2"
              >
                <Sparkles className="text-blue-500" size={24} />
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring" as const }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                >
                  User Management
                </motion.h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mt-2"
              >
                Manage all registered users in the system
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all hover:shadow-sm"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <UserPlus size={20} className="relative z-10" />
                <span className="relative z-10">Add User</span>
                <ArrowRight className="relative z-10 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={16} />
              </motion.button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: 'Total Users',
                value: stats.total,
                icon: UsersIcon,
                color: 'from-blue-500 to-cyan-400',
                trend: stats.growth,
                trendIcon: TrendingUp
              },
              {
                label: 'Active Users',
                value: stats.active,
                icon: UserCheck,
                color: 'from-emerald-500 to-green-400'
              },
              {
                label: 'Administrators',
                value: stats.admins,
                icon: Shield,
                color: 'from-purple-500 to-pink-400'
              },
              {
                label: "Today's Logins",
                value: stats.todayLogins,
                icon: Clock,
                color: 'from-amber-500 to-orange-400'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        className="text-3xl font-bold text-gray-900"
                      >
                        {stat.value}
                      </motion.p>
                      {stat.trend && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="text-sm text-emerald-600 font-medium flex items-center gap-1"
                        >
                          <stat.trendIcon size={14} />
                          {stat.trend}
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl group-hover:shadow-lg transition-all`}
                  >
                    <stat.icon className="text-white" size={24} />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                  className="h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-4"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Filters and Controls */}
            <motion.div
              className="flex flex-wrap gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  icon: Filter,
                  value: selectedRole,
                  onChange: setSelectedRole,
                  options: ['All Roles', 'Admin', 'Moderator', 'User'],
                  values: ['all', 'admin', 'moderator', 'user']
                },
                {
                  icon: AlertCircle,
                  value: selectedStatus,
                  onChange: setSelectedStatus,
                  options: ['All Status', 'Active', 'Inactive', 'Suspended'],
                  values: ['all', 'active', 'inactive', 'suspended']
                }
              ].map((filter, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <filter.icon size={18} className="text-gray-500" />
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-gray-700 cursor-pointer"
                  >
                    {filter.options.map((option, i) => (
                      <option key={option} value={filter.values[i]}>{option}</option>
                    ))}
                  </select>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl"
              >
                <span className="text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none focus:ring-0 text-gray-700 cursor-pointer"
                >
                  <option value="name">Name A-Z</option>
                  <option value="date">Newest First</option>
                  <option value="status">Status</option>
                </select>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow scale-110' : 'hover:bg-gray-100'}`}
                >
                  <div className="grid grid-cols-2 gap-1 w-5 h-5">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-400'}`}
                      />
                    ))}
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow scale-110' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex flex-col gap-1 w-5 h-5">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-400'}`}
                      />
                    ))}
                  </div>
                </motion.button>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 rounded-xl transition-colors"
              >
                Reset
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Users List/Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {viewMode === 'list' ? (
              /* List View */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                      <tr>
                        {['User', 'Contact', 'Password', 'Role', 'Status', 'Registration', 'Actions'].map((header, index) => (
                          <motion.th
                            key={header}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </motion.th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      <AnimatePresence>
                        {currentUsers.length > 0 ? (
                          currentUsers.map((user, index) => (
                            <motion.tr
                              key={user.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{
                                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                                transition: { duration: 0.2 }
                              }}
                              className="group"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-semibold ${user.avatarColor}`}
                                  >
                                    {getInitials(user.name)}
                                  </motion.div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1.5">
                                  <motion.div
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Mail size={14} className="text-gray-400" />
                                    <span className="text-gray-700">{user.email}</span>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Phone size={14} className="text-gray-400" />
                                    <span className="text-gray-500">{user.phone}</span>
                                  </motion.div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 font-mono">
                                  {user.password ? (
                                    <div className="flex items-center gap-2">
                                      <span className="opacity-50">••••••••</span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(user.password || '')}
                                        className="text-xs text-blue-500 hover:text-blue-700"
                                        title="Copy password"
                                      >
                                        Copy
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">No password</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}
                                >
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </motion.span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(user.status)}`}
                                  >
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                  </motion.span>
                                  <select
                                    value={user.status}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
                                    className="text-xs border border-gray-300 rounded-lg p-1.5 bg-transparent hover:bg-gray-50"
                                  >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                  </select>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  <Calendar size={12} className="inline mr-1" />
                                  {formatDate(user.registrationDate)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  <Calendar size={12} className="inline mr-1" />
                                  Last: {formatDate(user.lastLogin)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: '#dbeafe' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowEditModal(true);
                                    }}
                                    className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                                    title="Edit user"
                                  >
                                    <Edit size={18} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={isDeleting === user.id}
                                    className="p-2 text-gray-500 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete user"
                                  >
                                    {isDeleting === user.id ? (
                                      <Loader className="animate-spin" size={18} />
                                    ) : (
                                      <Trash2 size={18} />
                                    )}
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                                  >
                                    <MoreVertical size={18} />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan={6} className="px-6 py-12 text-center">
                              <motion.div
                                animate={{
                                  rotate: [0, 360],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{
                                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                  scale: { duration: 1, repeat: Infinity }
                                }}
                                className="text-gray-400 mb-2"
                              >
                                <Search size={48} className="mx-auto" />
                              </motion.div>
                              <p className="text-gray-500 font-medium">No users found</p>
                              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              /* Grid View */
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      variants={cardVariants}
                      whileHover={{
                        y: -8,
                        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
                        transition: { type: "spring", stiffness: 300 }
                      }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${user.avatarColor}`}
                          >
                            {getInitials(user.name)}
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ rotate: 90 }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                        >
                          <MoreVertical size={20} />
                        </motion.button>
                      </div>

                      <div className="space-y-4 mb-6">
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-gray-700">{user.email}</span>
                        </motion.div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-gray-700">{user.phone}</span>
                        </motion.div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Key size={16} className="text-gray-400" /> {/* Key icon add करें imports में */}
                          <span className="font-mono text-gray-700">
                            {user.password ? '••••••••' : 'No password'}
                          </span>
                          {user.password && (
                            <button
                              onClick={() => navigator.clipboard.writeText(user.password || '')}
                              className="ml-2 text-xs text-blue-500 hover:text-blue-700"
                              title="Copy password"
                            >
                              Copy
                            </button>
                          )}
                        </motion.div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </motion.span>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(user.status)}`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </motion.span>
                      </div>

                      <div className="text-xs text-gray-500 mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span>Registered</span>
                          <span className="font-medium text-gray-700">
                            <Calendar size={12} className="inline mr-1" />
                            {formatDate(user.registrationDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Last Login</span>
                          <span className="font-medium text-gray-700">
                            <Calendar size={12} className="inline mr-1" />
                            {formatDate(user.lastLogin)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: '#dbeafe' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="flex-1 py-2.5 text-sm font-medium text-blue-600 rounded-xl transition-colors"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: '#fee2e2' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeleting === user.id}
                          className="flex-1 py-2.5 text-sm font-medium text-rose-600 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {isDeleting === user.id ? (
                            <Loader className="animate-spin mx-auto" size={18} />
                          ) : (
                            'Delete'
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2.5 text-gray-500 hover:text-gray-700 rounded-xl"
                        >
                          <Eye size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="col-span-full bg-white rounded-2xl p-12 text-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                      className="text-gray-400 mb-4"
                    >
                      <Search size={64} className="mx-auto" />
                    </motion.div>
                    <p className="text-gray-500 text-lg font-medium mb-2">No users found</p>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(indexOfLastUser, sortedUsers.length)}
                </span>{' '}
                of <span className="font-semibold">{sortedUsers.length}</span> users
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    Add New User
                  </motion.h2>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: newUser.name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, name: e.target.value }), type: 'text', placeholder: 'Enter full name' },
                    { label: 'Email Address', value: newUser.email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, email: e.target.value }), type: 'email', placeholder: 'Enter email address' },
                    { label: 'Phone Number', value: newUser.phone, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, phone: e.target.value }), type: 'tel', placeholder: 'Enter phone number' },
                  ].map((field, index) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </motion.div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 text-gray-600 rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddUser}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl transition-all"
                  >
                    Add User
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    Edit User
                  </motion.h2>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: selectedUser.name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSelectedUser({ ...selectedUser, name: e.target.value }), type: 'text' },
                    { label: 'Email Address', value: selectedUser.email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSelectedUser({ ...selectedUser, email: e.target.value }), type: 'email' },
                  ].map((field, index) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password (Read-only)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedUser.password || 'No password set'}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl"
                      />
                      {selectedUser.password && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedUser.password || '');
                            showNotificationMessage('Password copied to clipboard!');
                          }}
                          className="px-3 py-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedUser.status}
                      onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </motion.div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-5 py-2.5 text-gray-600 rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditUser}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl transition-all"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}