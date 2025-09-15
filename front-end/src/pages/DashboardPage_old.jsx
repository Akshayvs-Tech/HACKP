import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedProgressBar from '../components/ui/AnimatedProgressBar';
import AutoSlidingGallery from '../components/ui/AutoSlidingGallery';
import { toast } from '../components/ui/Toast';
import { 
  Images, 
  PenTool, 
  Users, 
  TrendingUp,
  Camera,
  Clock,
  CheckCircle,
  ArrowRight,
  Upload,
  Shield,
  Database,
  Eye,
  AlertTriangle,
  Activity,
  BarChart3
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      toast.success('Upload Started', `Uploading ${files.length} image(s)...`);
      
      // Here you would typically upload to your backend
      // For now, we'll just show a success message
      setTimeout(() => {
        toast.success('Upload Complete', `${files.length} image(s) uploaded successfully!`);
      }, 2000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const navigateToAnnotations = () => {
    navigate('/annotations');
  };

  const stats = [
    {
      title: 'Evidence Images',
      value: '2,148',
      change: '+24%',
      icon: Shield,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      progress: 88,
      subtitle: 'Secure storage'
    },
    {
      title: 'AI Detections',
      value: '8,429',
      change: '+32%',
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      progress: 94,
      subtitle: 'Objects identified'
    },
    {
      title: 'Case Files',
      value: '156',
      change: '+8%',
      icon: Database,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      progress: 72,
      subtitle: 'Active investigations'
    },
    {
      title: 'Match Accuracy',
      value: '97.3%',
      change: '+1.8%',
      icon: Target,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      progress: 97,
      subtitle: 'AI precision rate'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Person of Interest detected',
      target: 'CCTV Footage - Location #A127',
      time: '2 minutes ago',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 2,
      action: 'Evidence uploaded',
      target: 'Case #2024-KL-0156',
      time: '15 minutes ago',
      icon: Upload,
      priority: 'medium'
    },
    {
      id: 3,
      action: 'Vehicle match found',
      target: 'License Plate DB - 89% confidence',
      time: '1 hour ago',
      icon: Search,
      priority: 'high'
    },
    {
      id: 4,
      action: 'Batch analysis completed',
      target: '156 surveillance images processed',
      time: '2 hours ago',
      icon: Zap,
      priority: 'low'
    }
  ];

  const quickActions = [
    {
      title: 'Evidence Gallery',
      description: 'Secure evidence management and analysis',
      icon: Shield,
      action: () => navigate('/gallery'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'AI Analysis',
      description: 'Intelligent object and pattern detection',
      icon: Eye,
      action: () => navigate('/annotations'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Upload Evidence',
      description: 'Secure image upload and processing',
      icon: Upload,
      action: triggerFileUpload,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="relative">
      {/* Floating Particle Background */}
      <FloatingParticles particleCount={40} />
      
      {/* Main Content */}
      <div className="relative z-10 space-y-4 animate-fade-in">
        {/* Welcome Section */}
        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-typewriter">
            Welcome back, Officer {user?.username || 'User'}!
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Intelligence Analytics Dashboard - Real-time evidence processing and AI-powered analysis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="animate-card-slide-in card-lift animate-glow-pulse hover:animate-card-hover transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-0" 
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor} animate-icon-spin`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-bold">
                    <AnimatedCounter 
                      value={stat.value} 
                      duration={2000 + index * 200}
                    />
                  </p>
                  <p className={`text-xs ${stat.color}`}>
                    {stat.change} from last month
                  </p>
                  {/* Progress Bar */}
                  <AnimatedProgressBar 
                    value={stat.progress} 
                    max={100} 
                    height={4}
                    delay={1000 + index * 200}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Gallery Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <Card className="card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 hover-glow group overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 animate-gradient-shift"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-6 w-6 text-blue-500 animate-heartbeat" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span className="gradient-text text-xl font-bold">🔒 Evidence Gallery Showcase</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Secure evidence collection with AI-powered pattern recognition and real-time analysis
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <AutoSlidingGallery />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          {/* Quick Actions */}
          <Card className="lg:col-span-1 card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 animate-glow-pulse hover-lift group overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 animate-gradient-shift"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl animate-pulse shadow-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white animate-bounce" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <span className="gradient-text font-bold">⚡ Quick Actions</span>
              </CardTitle>
              <CardDescription className="mt-2">
                Jump into action with one-click tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 animate-liquid-button hover-bounce hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-0 glass-card-enhanced group"
                  onClick={action.action}
                  style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-lg mr-3 ${action.color} text-white animate-wiggle shadow-lg`}>
                    <action.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium group-hover:text-primary transition-colors duration-300">{action.title}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </Button>
            ))}
          </CardContent>
        </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 hover-glow group overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 animate-gradient-shift"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3">
                <div className="relative">
                  <Activity className="h-6 w-6 text-green-500 animate-heartbeat" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                </div>
                <span className="gradient-text text-xl font-bold">📊 Live Activity Feed</span>
              </CardTitle>
              <CardDescription className="mt-2">
                Real-time intelligence updates and system alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-4 animate-fade-in-up hover:bg-white/10 dark:hover:bg-black/10 p-4 rounded-xl transition-all duration-300 hover-lift glass-card-enhanced group cursor-pointer"
                    style={{ animationDelay: `${1.8 + index * 0.1}s` }}
                  >
                    <div className={`p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      activity.priority === 'high' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-heartbeat' 
                        : activity.priority === 'medium'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-wiggle'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 animate-float'
                    }`}>
                      <activity.icon className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300">{activity.action}</p>
                        {activity.priority === 'high' && (
                          <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full animate-pulse border border-red-200 dark:border-red-700">
                            🚨 High Priority
                          </span>
                        )}
                        {activity.priority === 'medium' && (
                          <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full border border-yellow-200 dark:border-yellow-700">
                            ⚠️ Medium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{activity.target}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                      <Clock className="h-4 w-4 animate-pulse" />
                      <span className="font-medium">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Tips */}
        <Card className="card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 animate-glow-pulse animate-fade-in-up overflow-hidden" style={{ animationDelay: '2s' }}>
          <CardHeader className="relative">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20 animate-gradient-shift"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
              <div className="absolute bottom-4 left-8 w-12 h-12 bg-purple-400/30 rounded-full animate-pulse delay-500"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-400/20 rounded-full animate-ping delay-2000"></div>
            </div>
            
            <div className="relative z-10">
              <CardTitle className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl animate-pulse shadow-lg"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  🚀 Quick Start Intelligence Center
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Jump into action with our AI-powered evidence analysis tools
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Images - Enhanced Interactive Card */}
              <div 
                className="group relative overflow-hidden animate-fade-in-up card-lift hover:scale-105 transition-all duration-500 p-8 rounded-2xl cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 border-2 border-blue-200 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-2xl" 
                style={{ animationDelay: '2.2s' }}
                onClick={triggerFileUpload}
              >
                {/* Floating Background Elements */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-300/40 rounded-full animate-float"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-indigo-300/40 rounded-full animate-float delay-1000"></div>
                <div className="absolute top-1/2 right-6 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse delay-500"></div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/20 group-hover:to-indigo-400/20 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center animate-glow-pulse shadow-xl group-hover:rotate-6 transition-transform duration-300">
                      <Upload className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Ready to Upload</div>
                      <div className="text-xs text-blue-500 dark:text-blue-300">Drag & Drop Supported</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">
                      📤 Upload Evidence
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 leading-relaxed">
                      Securely upload crime scene photos, surveillance footage, and digital evidence for AI analysis
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileUpload();
                    }}
                  >
                    <Upload className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Choose Evidence Files
                  </Button>
                  
                  {/* Interactive Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mb-1">
                      <span>Storage Capacity</span>
                      <span>75% Available</span>
                    </div>
                    <AnimatedProgressBar value={75} max={100} height={6} delay={2000} className="rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Create Annotations - Enhanced Interactive Card */}
              <div 
                className="group relative overflow-hidden animate-fade-in-up card-lift hover:scale-105 transition-all duration-500 p-8 rounded-2xl cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-2 border-green-200 dark:border-green-600 hover:border-green-400 dark:hover:border-green-400 hover:shadow-2xl" 
                style={{ animationDelay: '2.4s' }}
                onClick={navigateToAnnotations}
              >
                {/* Floating Background Elements */}
                <div className="absolute top-3 right-3 w-5 h-5 bg-green-300/40 rounded-full animate-float delay-500"></div>
                <div className="absolute bottom-6 left-6 w-4 h-4 bg-emerald-300/40 rounded-full animate-float delay-1500"></div>
                <div className="absolute top-1/3 right-8 w-3 h-3 bg-green-400/40 rounded-full animate-pulse delay-750"></div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/20 group-hover:to-emerald-400/20 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center animate-glow-pulse shadow-xl group-hover:rotate-6 transition-transform duration-300">
                      <PenTool className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">AI Powered</div>
                      <div className="text-xs text-green-500 dark:text-green-300">Smart Detection</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-green-900 dark:text-green-100 group-hover:text-green-700 dark:group-hover:text-green-200 transition-colors">
                      🎯 AI Analysis
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2 leading-relaxed">
                      Advanced object detection, facial recognition, and evidence marking with intelligent annotation tools
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToAnnotations();
                    }}
                  >
                    <PenTool className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Start AI Analysis
                  </Button>
                  
                  {/* Interactive Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mb-1">
                      <span>Analysis Accuracy</span>
                      <span>97.3% Precision</span>
                    </div>
                    <AnimatedProgressBar value={97} max={100} height={6} delay={2200} className="rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Quick Tips */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h5 className="font-semibold text-purple-900 dark:text-purple-100">💡 Pro Tips</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                  <Target className="h-4 w-4" />
                  <span>Use keyboard shortcuts for faster annotation</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                  <Database className="h-4 w-4" />
                  <span>Auto-save keeps your work secure</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                  <Eye className="h-4 w-4" />
                  <span>AI suggests relevant annotations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
