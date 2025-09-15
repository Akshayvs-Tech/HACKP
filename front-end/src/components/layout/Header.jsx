import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Menu, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="hidden sm:block text-xl font-semibold">
            Photo Gallery Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 h-auto"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user?.username || 'User'}</span>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'
              }`} />
            </Button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className={`absolute right-0 top-full mt-2 w-64 border rounded-lg shadow-lg backdrop-blur-sm z-50 ${
                theme === 'light' 
                  ? 'bg-white border-gray-200' 
                  : 'bg-black border-gray-700'
              }`}>
                <div className={`p-4 border-b ${
                  theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {user?.username || 'User'}
                      </p>
                      <p className={`text-xs truncate ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={`w-full justify-start text-red-600 hover:text-red-700 ${
                      theme === 'light' 
                        ? 'hover:bg-red-50' 
                        : 'hover:bg-red-900/20'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
