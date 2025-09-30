import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";





/**
 * Modern Sidebar Component with collapsible submenu support
 * 
 * @param {Array} items - Menu items array
 * @param {Boolean} collapsed - Whether sidebar is collapsed (optional)
 */
export default function ModernSidebar({ items, collapsed = false }) {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  // Take the entire map of open/closed submenus, make a copy, find the specific submenu that was clicked using its index, and flip its status (open ⇌ closed).
  const toggleSubmenu = (index) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        {/* Sidebar Content */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                // Submenu Item
                <div>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && <item.icon size={20} />}
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      openSubmenus[index] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {/* Submenu Items */}
                  {openSubmenus[index] && !collapsed && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          to={sub.path}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(sub.path)
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Simple Menu Item
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  {item.icon && <item.icon size={20} />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer (optional) */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>© 2025 JobPortal</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}