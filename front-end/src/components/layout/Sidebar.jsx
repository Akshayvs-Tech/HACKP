import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { 
  X, 
  Home, 
  Images, 
  Settings, 
  Sun, 
  Moon,
  PenTool
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Photo Gallery', href: '/gallery', icon: Images },
    { name: 'Annotations', href: '/annotations', icon: PenTool },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur-xl border-r shadow-lg transform transition-all duration-300 ease-in-out lg:relative lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight">PhotoApp</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden hover:bg-accent/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md transform scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:transform hover:scale-[1.01]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={clsx(
                      "p-1 rounded-lg transition-colors",
                      isActive ? "bg-white/20" : "group-hover:bg-primary/10"
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-accent/50 transition-all duration-200 hover:scale-105"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
