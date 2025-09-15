import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const AnalyticsChart = ({ title, data, type = 'line', color = 'blue' }) => {
  const [animatedData, setAnimatedData] = useState(Array(data.length).fill(0));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data);
  const trend = data[data.length - 1] > data[0] ? 'up' : 'down';
  const trendPercentage = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1);

  // Fixed color classes to avoid dynamic generation issues
  const getColorStyles = (color) => {
    const styles = {
      blue: {
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconText: 'text-blue-600 dark:text-blue-400',
        barColor: '#3b82f6',
        gradientFrom: '#3b82f620',
        gradientTo: '#3b82f605'
      },
      green: {
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconText: 'text-green-600 dark:text-green-400',
        barColor: '#10b981',
        gradientFrom: '#10b98120',
        gradientTo: '#10b98105'
      },
      purple: {
        iconBg: 'bg-purple-100 dark:bg-purple-900/20',
        iconText: 'text-purple-600 dark:text-purple-400',
        barColor: '#8b5cf6',
        gradientFrom: '#8b5cf620',
        gradientTo: '#8b5cf605'
      },
      orange: {
        iconBg: 'bg-orange-100 dark:bg-orange-900/20',
        iconText: 'text-orange-600 dark:text-orange-400',
        barColor: '#f59e0b',
        gradientFrom: '#f59e0b20',
        gradientTo: '#f59e0b05'
      }
    };
    return styles[color] || styles.blue;
  };

  const colorStyle = getColorStyles(color);

  return (
    <Card className="backdrop-blur-sm bg-white/5 dark:bg-black/5 border-0 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-1.5 rounded-lg ${colorStyle.iconBg}`}>
            <BarChart3 className={`h-4 w-4 ${colorStyle.iconText}`} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{data[data.length - 1]}</span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(trendPercentage)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-20 relative">
          {type === 'line' ? (
            // SVG Line Chart
            <svg className="w-full h-full" viewBox="0 0 300 80">
              <defs>
                <linearGradient id={`gradient-${color}-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colorStyle.barColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={colorStyle.barColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area under the line */}
              <path
                d={`M 0,80 ${animatedData.map((value, index) => 
                  `L ${(index / (animatedData.length - 1)) * 300},${80 - (value / maxValue) * 60}`
                ).join(' ')} L 300,80 Z`}
                fill={`url(#gradient-${color}-${title.replace(/\s+/g, '')})`}
                className="transition-all duration-1000 ease-out"
              />
              
              {/* Line */}
              <path
                d={`M ${animatedData.map((value, index) => 
                  `${(index / (animatedData.length - 1)) * 300},${80 - (value / maxValue) * 60}`
                ).join(' L ')}`}
                fill="none"
                stroke={colorStyle.barColor}
                strokeWidth="2"
                className="transition-all duration-1000 ease-out"
              />
              
              {/* Data points */}
              {animatedData.map((value, index) => (
                <circle
                  key={index}
                  cx={(index / (animatedData.length - 1)) * 300}
                  cy={80 - (value / maxValue) * 60}
                  r="3"
                  fill={colorStyle.barColor}
                  className="transition-all duration-1000 ease-out"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </svg>
          ) : (
            // Bar Chart
            <div className="flex items-end justify-between h-full space-x-1">
              {animatedData.map((value, index) => (
                <div
                  key={index}
                  className="rounded-t transition-all duration-1000 ease-out flex-1"
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    background: `linear-gradient(to top, ${colorStyle.gradientFrom}, ${colorStyle.gradientTo})`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
