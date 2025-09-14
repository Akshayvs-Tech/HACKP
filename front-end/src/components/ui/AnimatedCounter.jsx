import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
  value, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = '' 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  // Extract number from value string (handles percentages, decimals, etc.)
  const extractNumber = (val) => {
    if (typeof val === 'number') return val;
    const match = val.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const targetValue = extractNumber(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = targetValue * easedProgress;
      setDisplayValue(currentValue);

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
  }, [isVisible, targetValue, duration]);

  // Format the display value to match the original format
  const formatValue = (val) => {
    if (value.toString().includes('%')) {
      return val.toFixed(1);
    } else if (value.toString().includes('.')) {
      return val.toFixed(1);
    } else if (val >= 1000) {
      return Math.floor(val).toLocaleString();
    } else {
      return Math.floor(val).toString();
    }
  };

  return (
    <span 
      ref={counterRef}
      className={`animate-count-up ${className}`}
      style={{
        animationDelay: isVisible ? '0s' : '1s'
      }}
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
