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
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-accent/50 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <h1 className="hidden sm:block text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              PhotoGallery Pro
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex hover:bg-accent/50 transition-all duration-200 hover:scale-105"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <Sun className="h-4 w-4 transition-transform duration-200" />
            )}
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="hidden sm:flex items-center px-3 py-2 h-auto hover:bg-accent/50 transition-all duration-200 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium ml-4">{user?.username || 'User'}</span>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ml-3 ${
                isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'
              }`} />
            </Button>

            {/* Enhanced Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 border rounded-xl shadow-xl backdrop-blur-md z-50 overflow-hidden animate-slide-down"
                   style={{
                     background: theme === 'light' 
                       ? 'rgba(255, 255, 255, 0.95)' 
                       : 'rgba(24, 24, 27, 0.95)',
                     borderColor: theme === 'light' 
                       ? 'rgb(226, 232, 240)' 
                       : 'rgb(39, 39, 42)'
                   }}>
                <div className={`p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10 ${
                  theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {user?.username || 'User'}
                      </p>
                      <p className={`text-xs truncate ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {user?.email || 'user@example.com'}
                      </p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        theme === 'light' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-green-900/20 text-green-400'
                      }`}>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 rounded-lg font-medium ${
                      theme === 'dark' ? 'text-red-400 hover:text-red-300' : ''
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
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
