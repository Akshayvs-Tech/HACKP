import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/Loading';
import EnhancedShimmer, { GalleryShimmerGrid } from '../ui/EnhancedShimmer';
import MasonryGrid from '../ui/MasonryGrid';
import AnimatedFilter from '../ui/AnimatedFilter';
import FloatingParticles from '../ui/FloatingParticles';
import { ChevronLeft, ChevronRight, Download, Maximize2, Search, Grid, List } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from '../ui/Toast';
import { useImages } from '../../contexts/ImageContext';

const LazyImage = ({ src, alt, className, onLoad, showOverlay = true, imageData = {}, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    // Disable intersection observer to prevent movement - load all images immediately
    setIsInView(true);
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div 
      ref={imgRef} 
      className={clsx("relative overflow-hidden gallery-item bg-muted", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoaded && (
        <EnhancedShimmer variant="gallery" className="absolute inset-0" />
      )}
      {isInView && (
        <div className="image-container relative w-full h-full">
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={(e) => {
              console.log('Image failed to load:', src);
              setIsLoaded(true); // Still mark as loaded to show placeholder
            }}
            className="w-full h-full object-cover"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'none',
              animation: 'none',
              transform: 'none'
            }}
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">Loading...</span>
            </div>
          )}
        </div>
      )}
      
      {/* Enhanced Hover Overlay */}
      {showOverlay && isLoaded && (
        <div className={clsx(
          "overlay transition-all duration-300 ease-out",
          isHovered ? "transform translate-y-0 opacity-100" : "transform translate-y-full opacity-0"
        )}>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">{imageData.title}</h3>
            <p className="text-xs text-gray-300 line-clamp-2">{imageData.description}</p>
            {imageData.tags && (
              <div className="flex flex-wrap gap-1">
                {imageData.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span>❤️ {imageData.likes}</span>
              <span>👁️ {imageData.views}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Zoom Icon */}
      <div className={clsx(
        "absolute inset-0 flex items-center justify-center transition-all duration-300",
        isHovered ? "bg-black/20 opacity-100" : "bg-transparent opacity-0"
      )}>
        <Maximize2 className="h-8 w-8 text-white transition-all duration-300 transform scale-0 group-hover:scale-100" />
      </div>
    </div>
  );
};

const ImageModal = ({ image, isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (hasPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext, onClose]);

  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="bg-black/95"
      showCloseButton={false}
    >
      <div className="relative flex items-center justify-center min-h-[80vh] p-4">
        {/* Navigation Buttons */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Image */}
        <div className="max-w-full max-h-full">
          <img
            src={image.url}
            alt={image.title}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        {/* Image Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{image.title}</h3>
              <p className="text-sm text-gray-300">{image.description}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(image.url, '_blank')}
                className="text-white hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  try {
                    // Fetch the image as blob to ensure proper download
                    const response = await fetch(image.url);
                    if (!response.ok) throw new Error('Failed to fetch image');
                    
                    const blob = await response.blob();
                    
                    // Create object URL and download
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${image.title.replace(/\s+/g, '_')}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    
                    // Cleanup
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    
                    toast.success('Download Complete', `${image.title} downloaded successfully!`);
                  } catch (error) {
                    console.error('Download failed:', error);
                    
                    // Fallback to direct link
                    try {
                      const link = document.createElement('a');
                      link.href = image.url;
                      link.download = `${image.title.replace(/\s+/g, '_')}.jpg`;
                      link.target = '_blank';
                      link.click();
                      toast.success('Download Complete', 'Image download initiated successfully!');
                    } catch (fallbackError) {
                      toast.error('Download Error', 'Unable to download image');
                    }
                  }
                }}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

const PhotoGallery = () => {
  const { getAllImages, uploadedImages, isInitialized } = useImages();
  const [allImages, setAllImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry' or 'grid'
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const imagesPerPage = 12;

  // Update allImages when uploaded images change or context is initialized
  useEffect(() => {
    if (isInitialized) {
      console.log('PhotoGallery: Loading images, uploaded count:', uploadedImages.length);
      const images = getAllImages(true); // Include mock images
      setAllImages(images);
      setIsLoading(false); // Set loading to false immediately when we have images
    }
  }, [uploadedImages, getAllImages, isInitialized]);

  // Filter configuration - include uploaded category
  const filters = [
    { key: 'all', label: 'All', count: allImages.length },
    { key: 'uploaded', label: 'Uploaded', count: allImages.filter(img => img.category === 'uploaded').length },
    { key: 'nature', label: 'Nature', count: allImages.filter(img => img.category === 'nature').length },
    { key: 'architecture', label: 'Architecture', count: allImages.filter(img => img.category === 'architecture').length },
    { key: 'people', label: 'People', count: allImages.filter(img => img.category === 'people').length },
    { key: 'technology', label: 'Technology', count: allImages.filter(img => img.category === 'technology').length },
    { key: 'abstract', label: 'Abstract', count: allImages.filter(img => img.category === 'abstract').length },
  ];

  // Filter and search logic
  const getFilteredImages = useCallback(() => {
    let filtered = allImages;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(img => img.category === activeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [allImages, activeFilter, searchTerm]);

  // Initial load - load images as soon as allImages is populated
  useEffect(() => {
    if (allImages.length > 0) {
      try {
        const filtered = getFilteredImages();
        setDisplayedImages(filtered.slice(0, imagesPerPage));
        console.log('PhotoGallery: Displayed', filtered.slice(0, imagesPerPage).length, 'images');
      } catch (error) {
        console.error('PhotoGallery: Error loading images:', error);
      }
    }
  }, [allImages, getFilteredImages, imagesPerPage]);

  // Handle filter changes with animation
  useEffect(() => {
    const filtered = getFilteredImages();
    
    // Animate out current images
    setDisplayedImages(prev => prev.map(img => ({ ...img, isRemoving: true })));
    
    setTimeout(() => {
      setDisplayedImages(filtered.slice(0, page * imagesPerPage));
    }, 200);
  }, [activeFilter, searchTerm, getFilteredImages, page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedImages, isLoadingMore]);

  const loadMoreImages = () => {
    if (isLoadingMore) return;
    
    const filtered = getFilteredImages();
    const currentLength = displayedImages.length;
    const nextImages = filtered.slice(currentLength, currentLength + imagesPerPage);
    
    if (nextImages.length === 0) return;

    setIsLoadingMore(true);
    
    setTimeout(() => {
      setDisplayedImages(prev => [...prev, ...nextImages]);
      setIsLoadingMore(false);
    }, 500);
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex < displayedImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const selectedImage = selectedImageIndex !== null ? displayedImages[selectedImageIndex] : null;

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <FloatingParticles particleCount={8} />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between animate-fade-in-up">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Photo Gallery
            </h2>
            <EnhancedShimmer variant="text" width="80px" height="20px" />
          </div>
          <GalleryShimmerGrid count={12} columns={viewMode === 'masonry' ? 4 : 3} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Particle Background */}
      <FloatingParticles particleCount={8} />
      
      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Photo Gallery
            </h2>
            <p className="text-muted-foreground mt-1">
              {displayedImages.length} of {getFilteredImages().length} photos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 w-64"
              />
            </div>
            
            {/* Filter */}
            <AnimatedFilter
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('masonry')}
                className={clsx(
                  "h-8 px-3 flex items-center space-x-1",
                  viewMode === 'masonry' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="4 Columns Grid"
              >
                <Grid className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">4 Col</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={clsx(
                  "h-8 px-3 flex items-center space-x-1",
                  viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="3 Columns Grid"
              >
                <List className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">3 Col</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="relative">
          {viewMode === 'masonry' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group cursor-pointer rounded-lg overflow-hidden bg-card border photo-card"
                  onClick={() => openModal(index)}
                >
                  <div className="aspect-[4/3] relative min-h-[200px]">
                    <LazyImage
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full"
                      imageData={image}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group cursor-pointer rounded-lg overflow-hidden bg-card border photo-card"
                  onClick={() => openModal(index)}
                >
                  <div className="aspect-square relative min-h-[200px]">
                    <LazyImage
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full"
                      imageData={image}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loading More */}
        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2 animate-fade-in-up">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading more photos...</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={closeModal}
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={selectedImageIndex > 0}
        hasNext={selectedImageIndex < displayedImages.length - 1}
      />
    </div>
  );
};

export default PhotoGallery;
