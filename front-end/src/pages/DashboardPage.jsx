import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useImages } from '../contexts/ImageContext';
import FloatingParticles from '../components/ui/FloatingParticles';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import AnimatedProgressBar from '../components/ui/AnimatedProgressBar';
import AutoSlidingGallery from '../components/ui/AutoSlidingGallery';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import { toast } from '../components/ui/Toast';
import { 
  Images, 
  PenTool, 
  Users, 
  Activity,
  Camera,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Upload,
  BarChart3,
  Settings
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { addUploadedImage, isLoading: imageLoading, uploadedImages, isInitialized } = useImages();
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Log uploaded images for debugging
  useEffect(() => {
    if (isInitialized) {
      console.log('Dashboard: Uploaded images count:', uploadedImages.length);
    }
  }, [uploadedImages, isInitialized]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          await addUploadedImage(file);
          return file.name;
        } catch (error) {
          console.error('Upload failed for', file.name, error);
          throw error;
        }
      });

      try {
        const uploadedFileNames = await Promise.all(uploadPromises);
        toast.success('Upload Complete', `${uploadedFileNames.length} image(s) uploaded successfully!`);
      } catch (error) {
        toast.error('Upload Failed', 'Some images failed to upload. Please try again.');
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const navigateToAnnotations = () => {
    navigate('/annotations');
  };

  const handleActivityClick = (activity) => {
    if (activity.type === 'annotation') {
      navigate('/annotations');
    } else if (activity.type === 'image') {
      navigate('/gallery');
    }
  };

  const stats = [
    {
      title: 'Total Images',
      value: (248 + uploadedImages.length).toString(),
      change: uploadedImages.length > 0 ? `+${uploadedImages.length}` : '+12%',
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
      icon: PenTool,
      type: 'annotation'
    },
    {
      id: 2,
      action: 'Image uploaded',
      target: 'Landscape Collection',
      time: '15 minutes ago',
      icon: Images,
      type: 'image'
    },
    {
      id: 3,
      action: 'Annotation verified',
      target: 'Car Detection - Image #98',
      time: '1 hour ago',
      icon: CheckCircle,
      type: 'annotation'
    },
    {
      id: 4,
      action: 'Batch processing completed',
      target: '45 images processed',
      time: '2 hours ago',
      icon: Activity,
      type: 'image'
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

        {/* Complex Analytics Dashboard */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <AnalyticsDashboard uploadedImages={uploadedImages} />
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {stats.slice(0, 4).map((stat, index) => (
            <Card 
              key={index} 
              className="animate-card-slide-in card-lift hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-0" 
              style={{ animationDelay: `${0.9 + index * 0.05}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className={`text-xs font-medium ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold">
                    <AnimatedCounter 
                      value={stat.value} 
                      duration={1500 + index * 100}
                    />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          {/* Quick Actions */}
          <Card className="lg:col-span-1 card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
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
                  className="w-full justify-start h-auto p-4 hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-0"
                  onClick={action.action}
                  style={{ animationDelay: `${1.4 + index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-lg mr-3 ${action.color} text-white`}>
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
              
              {/* Additional Quick Action - Settings */}
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-0"
                onClick={() => navigate('/settings')}
              >
                <div className="p-2 rounded-lg mr-3 bg-gray-500 hover:bg-gray-600 text-white">
                  <Settings className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">
                    Configure your workspace
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
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
                    className="flex items-start space-x-3 hover:bg-white/10 dark:hover:bg-black/10 p-3 rounded-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-white/20 dark:hover:border-gray-700"
                    style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <activity.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.target}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Gallery Section - Compact */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
          <Card className="card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-blue-500" />
                  <CardTitle>Featured Gallery</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/gallery')}
                  className="bg-white/10 dark:bg-black/10 border-0 hover:bg-white/20 dark:hover:bg-black/20"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore our curated collection
              </p>
            </CardHeader>
            <CardContent>
              <AutoSlidingGallery />
            </CardContent>
          </Card>
        </div>

        {/* Usage Tips */}
        <Card className="card-lift backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 animate-fade-in-up" style={{ animationDelay: '2.0s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-green-500" />
              <span>Getting Started</span>
            </CardTitle>
            <CardDescription>
              Learn how to make the most of your annotation workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Images - Clickable */}
              <div 
                className="space-y-3 card-lift hover:scale-105 transition-all duration-300 p-6 rounded-lg cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 hover:shadow-lg" 
                style={{ animationDelay: '2.2s' }}
                onClick={triggerFileUpload}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Upload Images</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Click here to upload new images to your workspace for annotation.
                </p>
                <Button 
                  className="w-full mt-3 bg-blue-500 hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileUpload();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images
                </Button>
              </div>
              
              {/* Create Annotations - Clickable */}
              <div 
                className="space-y-3 card-lift hover:scale-105 transition-all duration-300 p-6 rounded-lg cursor-pointer bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 hover:shadow-lg" 
                style={{ animationDelay: '2.4s' }}
                onClick={navigateToAnnotations}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <PenTool className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-green-900 dark:text-green-100">Create Annotations</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Start annotating images by clicking and dragging to select regions.
                </p>
                <Button 
                  className="w-full mt-3 bg-green-500 hover:bg-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToAnnotations();
                  }}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Start Annotating
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
