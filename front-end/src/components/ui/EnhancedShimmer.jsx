import React from 'react';

const EnhancedShimmer = ({ 
  width = '100%', 
  height = '200px', 
  className = '',
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    card: 'bg-gray-200 dark:bg-gray-700 rounded-lg',
    text: 'bg-gray-200 dark:bg-gray-700 rounded',
    circle: 'bg-gray-200 dark:bg-gray-700 rounded-full',
    gallery: 'bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square'
  };

  return (
    <div 
      className={`${variants[variant]} ${className} relative overflow-hidden`}
      style={{ width, height }}
    >
      {/* Primary shimmer effect */}
      <div className="absolute inset-0 shimmer opacity-60"></div>
      
      {/* Secondary pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      {/* Sparkle effect for gallery items */}
      {variant === 'gallery' && (
        <>
          <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </>
      )}
    </div>
  );
};

const GalleryShimmerGrid = ({ count = 12, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <EnhancedShimmer 
            variant="gallery"
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          />
          <div className="space-y-2">
            <EnhancedShimmer 
              variant="text" 
              height="16px" 
              width="80%"
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50 + 100}ms` }}
            />
            <EnhancedShimmer 
              variant="text" 
              height="12px" 
              width="60%"
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50 + 200}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedShimmer;
export { GalleryShimmerGrid };
