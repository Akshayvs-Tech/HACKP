import React, { useState, useEffect, useRef } from 'react';

const AnimatedProgressBar = ({ 
  value, 
  max = 100, 
  height = 8, 
  className = '',
  showValue = false,
  delay = 0
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const progressRef = useRef(null);

  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const duration = 1500; // 1.5 seconds
      
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      setProgress(percentage * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, percentage]);

  return (
    <div ref={progressRef} className={`w-full ${className}`}>
      <div 
        className="bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{ 
            width: `${progress}%`,
            transition: isVisible ? 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-30"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
        
        {/* Progress indicator dot */}
        {progress > 0 && (
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-blue-500 transition-all duration-300"
            style={{ 
              left: `calc(${progress}% - 6px)`,
              opacity: progress > 5 ? 1 : 0
            }}
          />
        )}
      </div>
      
      {showValue && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex justify-between">
          <span>{Math.round(progress)}%</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedProgressBar;
