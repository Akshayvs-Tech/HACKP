import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Bell, 
  Shield,
  LogOut
} from 'lucide-react';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-2 border-b border-border">
        <SettingsIcon className="h-7 w-7 text-primary" />
        <h2 className="text-3xl font-bold">Settings</h2>
      </div>

      {/* Settings Grid - Improved alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card className="h-fit">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <User className="h-5 w-5 text-blue-500" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input
                  value={user?.username || 'User'}
                  disabled
                  className="bg-muted/50 text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  value={user?.email || 'user@example.com'}
                  disabled
                  className="bg-muted/50 text-sm font-medium"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="h-fit">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <Palette className="h-5 w-5 text-purple-500" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Theme</h4>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleTheme}
                className="min-w-[80px] font-medium"
              >
                {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Animations</h4>
                <p className="text-xs text-muted-foreground">
                  Smooth transitions and effects
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled
                className="min-w-[80px] font-medium"
              >
                ✨ Enabled
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Session Timeout</h4>
                  <p className="text-xs text-muted-foreground">
                    Automatic logout timer for security
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="min-w-[80px] font-medium"
                >
                  ⏰ 30 min
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Auto Save</h4>
                  <p className="text-xs text-muted-foreground">
                    Automatically save annotations
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="min-w-[80px] font-medium"
                >
                  💾 Enabled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Enhanced */}
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Common account and application actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button 
              variant="destructive" 
              size="default"
              onClick={logout}
              className="flex items-center space-x-3 px-8 py-3 font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
