import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import AnalyticsChart from './AnalyticsChart';
import { 
  Eye, 
  Users, 
  Clock, 
  Download,
  Target,
  Zap,
  Calendar,
  Trophy,
  Layers,
  Monitor,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const AnalyticsDashboard = ({ uploadedImages = [] }) => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Mock analytics data - in a real app, this would come from your backend
  const generateAnalyticsData = () => {
    const today = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    return {
      dailyUploads: Array.from({ length: days }, (_, i) => 
        Math.floor(Math.random() * 20) + (uploadedImages.length > 0 && i === days - 1 ? uploadedImages.length : 0)
      ),
      dailyAnnotations: Array.from({ length: days }, () => Math.floor(Math.random() * 50) + 10),
      dailyViews: Array.from({ length: days }, () => Math.floor(Math.random() * 200) + 50),
      accuracy: Array.from({ length: days }, () => Math.floor(Math.random() * 10) + 85),
      processedImages: Array.from({ length: days }, () => Math.floor(Math.random() * 30) + 10),
      activeUsers: Array.from({ length: days }, () => Math.floor(Math.random() * 15) + 5)
    };
  };

  const [analytics, setAnalytics] = useState(generateAnalyticsData());

  useEffect(() => {
    setAnalytics(generateAnalyticsData());
  }, [timeRange, uploadedImages.length]);

  const performanceMetrics = [
    {
      label: 'Processing Speed',
      value: '2.3s',
      change: '-15%',
      icon: Zap,
      description: 'Avg. time per image',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      changeType: 'positive'
    },
    {
      label: 'Model Accuracy',
      value: '94.7%',
      change: '+2.1%',
      icon: Target,
      description: 'Current model performance',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      changeType: 'positive'
    },
    {
      label: 'User Engagement',
      value: '78.2%',
      change: '+5.4%',
      icon: Users,
      description: 'Daily active users',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      changeType: 'positive'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      icon: Monitor,
      description: 'Service availability',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      changeType: 'positive'
    }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <p className="text-sm text-muted-foreground">Track your annotation project performance</p>
        </div>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                timeRange === range.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card 
            key={index}
            className="backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.textColor}`} />
                </div>
                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full font-medium ${
                  metric.changeType === 'positive' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsChart
          title="Daily Image Uploads"
          data={analytics.dailyUploads}
          type="bar"
          color="blue"
        />
        <AnalyticsChart
          title="Annotations Created"
          data={analytics.dailyAnnotations}
          type="line"
          color="green"
        />
        <AnalyticsChart
          title="Gallery Views"
          data={analytics.dailyViews}
          type="line"
          color="purple"
        />
        <AnalyticsChart
          title="Model Accuracy"
          data={analytics.accuracy}
          type="line"
          color="orange"
        />
        <AnalyticsChart
          title="Images Processed"
          data={analytics.processedImages}
          type="bar"
          color="green"
        />
        <AnalyticsChart
          title="Active Users"
          data={analytics.activeUsers}
          type="line"
          color="blue"
        />
      </div>

      {/* Weekly Summary */}
      <Card className="backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>Weekly Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.dailyUploads.reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Total Uploads</p>
              <p className="text-xs text-muted-foreground mt-1">This {timeRange.replace('d', ' days')}</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analytics.dailyAnnotations.reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">Annotations</p>
              <p className="text-xs text-muted-foreground mt-1">This {timeRange.replace('d', ' days')}</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analytics.dailyViews.reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Total Views</p>
              <p className="text-xs text-muted-foreground mt-1">This {timeRange.replace('d', ' days')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
