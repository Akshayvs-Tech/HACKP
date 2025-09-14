import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import FloatingParticles from '../components/ui/FloatingParticles';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import AnimatedProgressBar from '../components/ui/AnimatedProgressBar';
import AutoSlidingGallery from '../components/ui/AutoSlidingGallery';
import { 
  Images, 
  PenTool, 
  Users, 
  Activity,
  Camera,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    {
      title: 'Total Images',
      value: '248',
      change: '+12%',
      icon: Images,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      progress: 85
    },
    {
      title: 'Annotations',
      value: '1,429',
      change: '+18%',
      icon: PenTool,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      progress: 92
    },
    {
      title: 'Active Users',
      value: '42',
      change: '+5%',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      progress: 68
    },
    {
      title: 'Accuracy',
      value: '94.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      progress: 94
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New annotation created',
      target: 'Building Detection - Image #127',
      time: '2 minutes ago',
      icon: PenTool
    },
    {
      id: 2,
      action: 'Image uploaded',
      target: 'Landscape Collection',
      time: '15 minutes ago',
      icon: Images
    },
    {
      id: 3,
      action: 'Annotation verified',
      target: 'Car Detection - Image #98',
      time: '1 hour ago',
      icon: CheckCircle
    },
    {
      id: 4,
      action: 'Batch processing completed',
      target: '45 images processed',
      time: '2 hours ago',
      icon: Activity
    }
  ];

  const quickActions = [
    {
      title: 'Browse Gallery',
      description: 'View and manage your image collection',
      icon: Images,
      action: () => navigate('/gallery'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create Annotations',
      description: 'Annotate images with labels and regions',
      icon: PenTool,
      action: () => navigate('/annotations'),
      color: 'bg-green-500 hover:bg-green-600'
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
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Here's what's happening with your photo annotation project today.
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
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
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
          <Card className="card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-blue-500" />
                <span>Featured Photo Gallery</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Explore our curated collection with auto-sliding showcase
              </p>
            </CardHeader>
            <CardContent>
              <AutoSlidingGallery />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          {/* Quick Actions */}
          <Card className="lg:col-span-1 card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 animate-glow-pulse">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 animate-liquid-button animate-ripple hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-0"
                  onClick={action.action}
                  style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-lg mr-3 ${action.color} text-white animate-icon-spin`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            ))}
          </CardContent>
        </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 animate-glow-pulse">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 animate-icon-spin" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest updates from your annotation workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3 animate-fade-in-up hover:bg-white/5 dark:hover:bg-black/5 p-3 rounded-lg transition-all duration-300 card-lift"
                    style={{ animationDelay: `${1.8 + index * 0.1}s` }}
                  >
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-glow-pulse">
                      <activity.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.target}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 animate-pulse" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Tips */}
        <Card className="card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 animate-glow-pulse animate-fade-in-up" style={{ animationDelay: '2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
              <span>Getting Started</span>
            </CardTitle>
            <CardDescription>
              Learn how to make the most of your annotation workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 animate-fade-in-up card-lift hover:scale-105 transition-all duration-300 p-4 rounded-lg" style={{ animationDelay: '2.2s' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center animate-glow-pulse">
                  <Images className="h-4 w-4 text-white animate-icon-spin" />
                </div>
                <h4 className="font-medium">Upload Images</h4>
                <p className="text-sm text-muted-foreground">
                  Start by browsing the photo gallery to view available images for annotation.
                </p>
                <AnimatedProgressBar value={75} max={100} height={3} delay={2000} />
              </div>
              <div className="space-y-2 animate-fade-in-up card-lift hover:scale-105 transition-all duration-300 p-4 rounded-lg" style={{ animationDelay: '2.4s' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center animate-glow-pulse">
                  <PenTool className="h-4 w-4 text-white animate-icon-spin" />
                </div>
                <h4 className="font-medium">Create Annotations</h4>
                <p className="text-sm text-muted-foreground">
                  Click and drag to select regions on images, then add descriptive labels.
                </p>
                <AnimatedProgressBar value={60} max={100} height={3} delay={2200} />
              </div>
              <div className="space-y-2 animate-fade-in-up card-lift hover:scale-105 transition-all duration-300 p-4 rounded-lg" style={{ animationDelay: '2.6s' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center animate-glow-pulse">
                  <CheckCircle className="h-4 w-4 text-white animate-icon-spin" />
                </div>
                <h4 className="font-medium">Save & Export</h4>
                <p className="text-sm text-muted-foreground">
                  Save your annotations and export them in JSON format for further processing.
                </p>
                <AnimatedProgressBar value={90} max={100} height={3} delay={2400} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
