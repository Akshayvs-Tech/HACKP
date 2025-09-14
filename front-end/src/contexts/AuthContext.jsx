import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions
const mockAuthAPI = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const token = 'mock-jwt-token-' + Date.now();
      return {
        success: true,
        token,
        user: { id: user.id, username: user.username, email: user.email }
      };
    } else if (email === 'admin@example.com' && password === 'password') {
      // Default admin user for demo
      const token = 'mock-jwt-token-' + Date.now();
      return {
        success: true,
        token,
        user: { id: 1, username: 'admin', email: 'admin@example.com' }
      };
    } else {
      throw new Error('Invalid email or password');
    }
  },

  register: async (username, email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error('Username already exists');
      } else {
        throw new Error('Email already exists');
      }
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Just return success without tokens (user needs to login)
    return {
      success: true,
      message: 'Account created successfully'
    };
  },
  
  validateToken: async (token) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock token validation
    if (token && token.startsWith('mock-jwt-token-')) {
      // For demo, return a default user - in real app, decode token
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        return {
          success: true,
          user: JSON.parse(storedUser)
        };
      } else {
        return {
          success: true,
          user: { id: 1, username: 'admin', email: 'admin@example.com' }
        };
      }
    } else {
      throw new Error('Invalid token');
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored token on app start
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      validateStoredToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const validateStoredToken = async (storedToken) => {
    try {
      const response = await mockAuthAPI.validateToken(storedToken);
      if (response.success) {
        setToken(storedToken);
        setUser(response.user);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      localStorage.removeItem('authToken');
      console.error('Token validation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthAPI.login(email, password);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthAPI.register(username, email, password);
      
      if (response.success) {
        // Auto-login after successful registration
        const loginResponse = await mockAuthAPI.login(email, password);
        if (loginResponse.success) {
          setToken(loginResponse.token);
          setUser(loginResponse.user);
          localStorage.setItem('authToken', loginResponse.token);
          localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
        }
        return { success: true, message: 'Account created successfully! Welcome to your dashboard.' };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
