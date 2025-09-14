import React, { useState } from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { toast } from '../ui/Toast';
import { Eye, EyeOff, Lock, User, Sun, Moon, Mail } from 'lucide-react';

const RegisterPage = () => {
  const { register, loading, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      toast.success('Registration Successful!', result.message || 'Account created successfully! Welcome to your dashboard.');
      // Redirect to dashboard after successful registration
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Registration Failed', result.error || 'Failed to create account');
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
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full backdrop-blur-md border-0 animate-float animate-glow" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-100/20 rounded-full backdrop-blur-md border-0 animate-float animate-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-indigo-100/15 rounded-full backdrop-blur-md border-0 animate-float animate-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-100/20 rounded-full backdrop-blur-md border-0 animate-float animate-glow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-cyan-100/15 rounded-full backdrop-blur-md border-0 animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-rose-100/15 rounded-full backdrop-blur-md border-0 animate-float" style={{ animationDelay: '1.5s' }} />
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
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full backdrop-blur-md border-0 animate-float animate-glow" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400/10 rounded-full backdrop-blur-md border-0 animate-float animate-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-indigo-400/8 rounded-full backdrop-blur-md border-0 animate-float animate-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-400/10 rounded-full backdrop-blur-md border-0 animate-float animate-glow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-cyan-400/8 rounded-full backdrop-blur-md border-0 animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-rose-400/8 rounded-full backdrop-blur-md border-0 animate-float" style={{ animationDelay: '1.5s' }} />
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
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-foreground/80">
              Sign up to get started with your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-200" />
                  <Input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    className="pl-10 backdrop-blur-[1px] bg-white/30 dark:bg-black/30 border-0 focus:border focus:border-white/30 text-gray-200 placeholder:text-gray-200 placeholder:font-medium rounded-full"
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-200" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
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
                    className="absolute right-3 top-3 text-gray-200 hover:text-white transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-200" />
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    className="pl-10 pr-10 backdrop-blur-[1px] bg-white/30 dark:bg-black/30 border-0 focus:border focus:border-white/30 text-gray-200 placeholder:text-gray-200 placeholder:font-medium rounded-full"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-200 hover:text-white transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="glass"
                className="w-full text-foreground font-semibold transition-all duration-300 rounded-[1.5rem] cursor-pointer" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="text-sm text-foreground/70">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-foreground font-semibold hover:underline transition-all duration-300"
                >
                  Sign in here
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
