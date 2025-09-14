import React from 'react';
import { clsx } from 'clsx';

const LoadingSpinner = ({ size = 'default', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <svg 
      className={clsx(
        "animate-spin text-current",
        sizes[size],
        className
      )}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const LoadingSkeleton = ({ className, ...props }) => (
  <div
    className={clsx(
      "animate-pulse rounded-md bg-muted",
      className
    )}
    {...props}
  />
);

const LoadingPage = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
    <LoadingSpinner size="xl" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

const LoadingOverlay = ({ isLoading, children, message = "Loading..." }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingSkeleton, LoadingPage, LoadingOverlay };
