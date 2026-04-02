import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaBoxes,
  FaShoppingCart,
  FaCog,
  FaBell
} from "react-icons/fa";
import logo from "../../assets/images/logo_elmich.png";


const AdminHeader = ({ activeTab, onTabChange, adminName = "Admin" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('adminToken');
    // Redirect to login
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'products', label: 'Products', icon: FaBoxes },
    { id: 'orders', label: 'Orders', icon: FaShoppingCart },
    { id: 'categories', label: 'Categories', icon: FaBars },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <header className="w-full font-sans bg-white shadow-md sticky top-0 z-50">
      {/* Minimal Top Bar - Only essential info */}
      <div className="bg-[#ed1c24] text-white text-xs py-1.5">
        <div className=" max-w-7xl mx-auto px-4 flex justify-end items-center gap-4">
          <span>Admin Panel</span>
          <span className="text-gray-400">|</span>
          <span>Version 1.0</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-gray-700 text-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/admin" className="flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Actual logo image */}
              <img 
                src={logo} 
                alt="Elmich Logo" 
                className="h-10 w-auto object-contain"
              />
              <div className="hidden sm:block">
                
               
              </div>
            </div>
          </Link>

          {/* Search - Simplified for admin */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search users, orders, products..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            </div>
          </div>

          {/* Right Side - Admin Profile & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
              <FaBell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            {/* Admin Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <FaUser size={14} />
                        Profile Settings
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaSignOutAlt size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`bg-white border-b border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-col lg:flex-row lg:space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors w-full lg:w-auto
                      ${isActive 
                        ? 'text-red-600 border-b-2 border-red-600 lg:border-b-2' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;