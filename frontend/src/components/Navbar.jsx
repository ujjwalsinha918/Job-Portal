import React from "react";
import { Link } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white px-6 py-3 shadow-md">
      {/* Left Section - Brand/Logo */}
      <div className="text-xl font-bold">
        <Link to="/">JobPortal</Link>
      </div>

      {/* Middle Section - Nav Links */}
      <div className="flex space-x-6">
        <Link to="/jobseeker/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/jobs" className="hover:text-gray-300">
          Jobs
        </Link>
      </div>

      {/* Right Section - Notifications + Avatar + Logout */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <Bell size={22} className="cursor-pointer hover:text-gray-300" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white rounded-full px-1">
            3
          </span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <User size={18} />
        </div>

        {/* Logout */}
        <button className="hover:text-gray-300">
          <LogOut size={22} />
        </button>
      </div>
    </nav>
  );
}
