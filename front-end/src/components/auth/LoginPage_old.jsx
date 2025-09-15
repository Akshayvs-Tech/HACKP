import React, { useState } from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { toast } from '../ui/Toast';
import { Eye, EyeOff, Lock, User, Sun, Moon, Mail, Shield, Badge, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login Successful!', 'Welcome back! Redirecting to your dashboard.');
      // Redirect to dashboard after successful login
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Login Failed', result.error || 'Invalid email or password');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background with Images */}
      <div className="absolute inset-0 z-0">
        {/* Light theme background */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background image for light theme */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
            }}
          />
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
          {/* Floating glass elements for light theme */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full backdrop-blur-md border border-white/20 animate-float animate-glow" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-100/20 rounded-full backdrop-blur-md border border-blue-200/30 animate-float animate-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-indigo-100/15 rounded-full backdrop-blur-md border border-indigo-200/25 animate-float animate-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-100/20 rounded-full backdrop-blur-md border border-purple-200/30 animate-float animate-glow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-cyan-100/15 rounded-full backdrop-blur-md border border-cyan-200/25 animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-rose-100/15 rounded-full backdrop-blur-md border border-rose-200/25 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* Dark theme background */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background image for dark theme */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
            }}
          />
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          {/* Floating glass elements for dark theme */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full backdrop-blur-md border border-white/10 animate-float animate-glow" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400/10 rounded-full backdrop-blur-md border border-blue-400/20 animate-float animate-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-indigo-400/8 rounded-full backdrop-blur-md border border-indigo-400/15 animate-float animate-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-400/10 rounded-full backdrop-blur-md border border-purple-400/20 animate-float animate-glow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-cyan-400/8 rounded-full backdrop-blur-md border border-cyan-400/15 animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-rose-400/8 rounded-full backdrop-blur-md border border-rose-400/15 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Theme Toggle Button */}
      <Button
        variant="glass"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 text-foreground shadow-lg transition-all duration-300 rounded-[1.25rem] cursor-pointer"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-4 animate-slide-up">
        <Card className="backdrop-blur-[2px] bg-white/20 dark:bg-black/20 border-0 shadow-2xl transition-all duration-300 rounded-[3rem]">
          <CardHeader className="space-y-4 text-center">
            {/* Kerala Police Logo/Branding */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                <Badge className="absolute -bottom-1 -left-1 w-6 h-6 text-white bg-orange-500 rounded-full p-1" />
              </div>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Intelligence Analytics
                </h1>
                <p className="text-sm text-foreground/70 font-medium">Kerala Police • AI Vision Platform</p>
              </div>
            </div>
            
            <div className="border-t border-foreground/20 pt-4">
              <CardTitle className="text-xl font-semibold text-foreground">Secure Access Portal</CardTitle>
              <CardDescription className="text-foreground/70 mt-1">
                Enter your credentials to access the intelligence system
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-200" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    className="pl-10 backdrop-blur-[1px] bg-white/30 dark:bg-black/30 border-0 focus:border focus:border-white/30 text-gray-200 placeholder:text-gray-200 placeholder:font-medium rounded-full"
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-200" />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    className="pl-10 pr-10 backdrop-blur-[1px] bg-white/30 dark:bg-black/30 border-0 focus:border focus:border-white/30 text-gray-200 placeholder:text-gray-200 placeholder:font-medium rounded-full"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-200 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-3 bg-yellow-100/20 dark:bg-yellow-900/20 border border-yellow-200/30 dark:border-yellow-700/30 rounded-xl">
                <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-xs font-medium">Secure Law Enforcement Access</p>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  All activities are logged and monitored for security purposes
                </p>
              </div>

              <Button 
                type="submit" 
                variant="glass"
                className="w-full text-foreground font-semibold transition-all duration-300 rounded-[1.5rem] cursor-pointer" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Secure Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <div className="text-sm text-foreground/70">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-foreground/70 font-semibold hover:underline transition-all duration-300"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
