import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '../ui/Button';

const AutoSlidingGallery = ({ 
  images = [], 
  autoSlideInterval = 4000,
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Default images if none provided
  const defaultImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      title: 'Mountain Landscape',
      description: 'Beautiful mountain scenery with pristine lakes'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      title: 'Modern Architecture',
      description: 'Stunning architectural design and structure'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      title: 'City Skyline',
      description: 'Urban landscape with impressive skyline'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop',
      title: 'Ocean Waves',
      description: 'Peaceful ocean waves on a sunny day'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
      title: 'Forest Path',
      description: 'Serene forest trail through tall trees'
    }
  ];

  const galleryImages = images.length > 0 ? images : defaultImages;

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, galleryImages.length, autoSlideInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className={`relative w-full h-80 rounded-xl overflow-hidden shadow-lg group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop`;
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-1">{image.title}</h3>
              <p className="text-sm opacity-90">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className={`absolute inset-0 flex items-center justify-between p-4 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="bg-black/20 hover:bg-black/40 text-white border-0 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="bg-black/20 hover:bg-black/40 text-white border-0 backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Play/Pause Control */}
      <div className={`absolute top-4 right-4 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="bg-black/20 hover:bg-black/40 text-white border-0 backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className={`h-full bg-primary transition-all duration-300 ${
            isPlaying && !isHovered ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${((currentIndex + 1) / galleryImages.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default AutoSlidingGallery;
