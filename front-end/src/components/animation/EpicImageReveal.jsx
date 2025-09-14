import React, { useState, useEffect } from 'react';

const EpicImageReveal = ({ 
  imageUrl, 
  alt, 
  className = '', 
  onImageLoad,
  onRevealComplete,
  children 
}) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    if (imageLoaded && !isRevealing) {
      // Start the epic reveal sequence
      setIsRevealing(true);
      
      // Complete the reveal after animation duration
      const timer = setTimeout(() => {
        setRevealComplete(true);
        onRevealComplete?.();
      }, 1500); // Matches the longest animation duration

      return () => clearTimeout(timer);
    }
  }, [imageLoaded, isRevealing, onRevealComplete]);

  const handleImageLoad = (e) => {
    setImageLoaded(true);
    onImageLoad?.(e);
  };

  // Create pieces with different reveal directions
  const pieces = [
    { id: 1, direction: 'top', delay: '0ms' },
    { id: 2, direction: 'left', delay: '100ms' },
    { id: 3, direction: 'right', delay: '200ms' },
    { id: 4, direction: 'bottom', delay: '300ms' },
    { id: 5, direction: 'center', delay: '400ms' }
  ];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Hidden image for loading */}
      <img
        src={imageUrl}
        alt={alt}
        onLoad={handleImageLoad}
        className="absolute opacity-0 pointer-events-none"
      />

      {/* Epic reveal pieces */}
      {isRevealing && (
        <div className="relative">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`
                absolute inset-0 overflow-hidden
                ${revealComplete ? '' : `epic-reveal-${piece.direction}`}
              `}
              style={{
                animationDelay: piece.delay,
                clipPath: getClipPath(piece.direction, pieces.length)
              }}
            >
              <img
                src={imageUrl}
                alt={alt}
                className={`w-full h-full object-cover ${className}`}
              />
            </div>
          ))}
          
          {/* Overlay children after reveal */}
          {revealComplete && (
            <div className="absolute inset-0">
              {children}
            </div>
          )}
        </div>
      )}

      {/* Fallback for no animation */}
      {!imageLoaded && (
        <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to create clip paths for different pieces
const getClipPath = (direction, totalPieces) => {
  switch (direction) {
    case 'top':
      return 'polygon(0 0, 100% 0, 100% 20%, 0 20%)';
    case 'left':
      return 'polygon(0 20%, 20% 20%, 20% 80%, 0 80%)';
    case 'right':
      return 'polygon(80% 20%, 100% 20%, 100% 80%, 80% 80%)';
    case 'bottom':
      return 'polygon(0 80%, 100% 80%, 100% 100%, 0 100%)';
    case 'center':
      return 'polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)';
    default:
      return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
  }
};

export default EpicImageReveal;
