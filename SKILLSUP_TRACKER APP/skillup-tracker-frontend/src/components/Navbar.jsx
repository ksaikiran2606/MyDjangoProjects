import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { path: '/activities', label: 'Activities', icon: BookOpen },
    { path: '/add-activity', label: 'Add Activity', icon: BookOpen },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              <BookOpen className="w-8 h-8 text-primary-500" />
              <span>SkillUp Tracker</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive(item.path)
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                </div>

                <DarkModeToggle />

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;