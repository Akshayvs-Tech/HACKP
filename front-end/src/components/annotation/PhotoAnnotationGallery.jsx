import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LoadingSkeleton } from '../ui/Loading';
import EnhancedShimmer from '../ui/EnhancedShimmer';
import AnimatedFilter from '../ui/AnimatedFilter';
import FloatingParticles from '../ui/FloatingParticles';
import AnimatedAnnotationCanvas from './AnimatedAnnotationCanvas';
import { 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  Image as ImageIcon, 
  Save, 
  Download, 
  Zap, 
  Target,
  Search,
  Grid,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from '../ui/Toast';
import { useImages } from '../../contexts/ImageContext';
import { useTheme } from '../../contexts/ThemeContext';

// Mock API functions with persistent storage
const mockAnnotationAPI = {
  saveAnnotations: async (imageId, annotations, picId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Store annotations using both imageId and picId for uniqueness
    const storageKey = `annotations_${imageId}_pic_${picId}`;
    localStorage.setItem(storageKey, JSON.stringify(annotations));
    return { success: true, message: 'Annotations saved successfully' };
  },
  
  loadAnnotations: async (imageId, picId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Load annotations using both imageId and picId
    const storageKey = `annotations_${imageId}_pic_${picId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored annotations:', error);
        return [];
      }
    }
    
    // No default annotations - start fresh for each image
    return [];
  }
};

const AnnotationImageCard = ({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [actualAnnotationCount, setActualAnnotationCount] = useState(0);

  // Load actual annotation count
  useEffect(() => {
    const loadAnnotationCount = async () => {
      try {
        const annotations = await mockAnnotationAPI.loadAnnotations(image.id, image.picId);
        setActualAnnotationCount(annotations.length);
      } catch (error) {
        setActualAnnotationCount(0);
      }
    };
    loadAnnotationCount();
  }, [image.id, image.picId]);

  return (
    <div 
      className="group cursor-pointer rounded-lg overflow-hidden bg-card border photo-card"
      onClick={() => onClick(image)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[4/3] relative min-h-[200px]">
        {!isLoaded && (
          <EnhancedShimmer variant="gallery" className="absolute inset-0" />
        )}
        <img
          src={image.thumbnail}
          alt={image.title}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'none',
            animation: 'none',
            transform: 'none'
          }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        )}
        
        {/* Simple annotation overlay - minimal like gallery */}
        <div className={clsx(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isHovered ? "bg-black/10 opacity-100" : "bg-transparent opacity-0"
        )}>
          <PenTool className="h-6 w-6 text-white transition-all duration-300 transform scale-0 group-hover:scale-100 drop-shadow-lg" />
        </div>

        {/* Annotation count badge - simplified */}
        {actualAnnotationCount > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            {actualAnnotationCount}
          </div>
        )}
      </div>
    </div>
  );
};

const AnnotationModal = ({ 
  image, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext,
  onAnnotationsSaved 
}) => {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  useEffect(() => {
    if (image && isOpen) {
      loadAnnotations();
    }
  }, [image, isOpen]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && annotations.length > 0) {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      // Set new auto-save timeout for 3 seconds
      const timeout = setTimeout(() => {
        saveAnnotations(true); // true indicates auto-save
      }, 3000);
      
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [hasUnsavedChanges, annotations]);

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
        case 's':
        case 'S':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            saveAnnotations();
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext, onClose]);

  const loadAnnotations = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      const loadedAnnotations = await mockAnnotationAPI.loadAnnotations(image.id, image.picId);
      setAnnotations(loadedAnnotations);
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Error', 'Failed to load annotations');
    } finally {
      setLoading(false);
    }
  };

  const saveAnnotations = async (isAutoSave = false) => {
    setSaving(true);
    try {
      await mockAnnotationAPI.saveAnnotations(image.id, annotations, image.picId);
      setHasUnsavedChanges(false);
      
      if (!isAutoSave) {
        toast.success('Success', 'Annotations saved successfully');
      }
      
      // Notify parent to refresh gallery
      onAnnotationsSaved?.();
    } catch (error) {
      toast.error('Error', 'Failed to save annotations');
    } finally {
      setSaving(false);
    }
  };

  const handleAnnotationsChange = (newAnnotations) => {
    setAnnotations(newAnnotations);
    setHasUnsavedChanges(true);
  };

  const handleAnnotationCreate = (annotation) => {
    const newAnnotations = [...annotations, annotation];
    setAnnotations(newAnnotations);
    setHasUnsavedChanges(true);
  };

  const handleAnnotationUpdate = (updatedAnnotation) => {
    const newAnnotations = annotations.map(ann => 
      ann.id === updatedAnnotation.id ? updatedAnnotation : ann
    );
    setAnnotations(newAnnotations);
    setHasUnsavedChanges(true);
  };

  const handleAnnotationDelete = (annotationId) => {
    const newAnnotations = annotations.filter(ann => ann.id !== annotationId);
    setAnnotations(newAnnotations);
    setHasUnsavedChanges(true);
  };

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95">
      {/* Backdrop - click to close */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      {/* Main content container */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {loading ? (
          <div className="flex items-center justify-center text-white">
            <LoadingSkeleton />
          </div>
        ) : (
          <div 
            className="relative max-w-5xl max-h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Annotation Canvas */}
            <AnimatedAnnotationCanvas
              imageUrl={image.url}
              annotations={annotations}
              onAnnotationCreate={handleAnnotationCreate}
              onAnnotationUpdate={handleAnnotationUpdate}
              onAnnotationDelete={handleAnnotationDelete}
              isEditable={isAnnotationMode}
            />
          </div>
        )}
        
        {/* Control buttons */}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>
        
        {/* Save button */}
        <button
          onClick={() => saveAnnotations()}
          disabled={saving || !hasUnsavedChanges}
          className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={saving ? "Saving..." : hasUnsavedChanges ? "Save Annotations (Ctrl+S)" : "No changes to save"}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
        </button>
        
        {/* Annotation mode toggle */}
        <button
          onClick={() => setIsAnnotationMode(!isAnnotationMode)}
          className={`absolute top-4 right-28 w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 ${
            isAnnotationMode 
              ? 'bg-blue-500/70 hover:bg-blue-500/80 text-white' 
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={isAnnotationMode ? "Exit Annotation Mode" : "Enter Annotation Mode"}
        >
          <PenTool size={16} />
        </button>
        
        {/* Previous button */}
        {hasPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
            title="Previous Image (←)"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {/* Next button */}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
            title="Next Image (→)"
          >
            <ChevronRight size={24} />
          </button>
        )}
        
        {/* Status indicator */}
        {hasUnsavedChanges && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-500/80 text-black text-sm font-medium backdrop-blur-sm">
            Unsaved changes • Auto-save in 3s
          </div>
        )}
      </div>
    </div>
  );
};

const PhotoAnnotationGallery = () => {
  const { getAllImages, uploadedImages, isInitialized } = useImages();
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render of cards

  // Update images when uploaded images change or context is initialized
  useEffect(() => {
    console.log('PhotoAnnotationGallery: isInitialized:', isInitialized, 'uploadedImages count:', uploadedImages.length);
    if (isInitialized) {
      console.log('PhotoAnnotationGallery: Loading images, uploaded count:', uploadedImages.length);
      const images = getAllImages(true); // Include mock images
      console.log('PhotoAnnotationGallery: Total images loaded:', images.length);
      setAllImages(images);
    }
  }, [uploadedImages, getAllImages, isInitialized]);

  const categories = ['all', 'uploaded', ...new Set(allImages.filter(img => img.category !== 'uploaded').map(img => img.category))];

  useEffect(() => {
    let filtered = allImages;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [selectedCategory, searchTerm, allImages, refreshKey]);

  const handleImageClick = (image) => {
    const index = filteredImages.findIndex(img => img.id === image.id);
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setSelectedImage(filteredImages[newIndex]);
      setCurrentImageIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < filteredImages.length - 1) {
      const newIndex = currentImageIndex + 1;
      setSelectedImage(filteredImages[newIndex]);
      setCurrentImageIndex(newIndex);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setCurrentImageIndex(-1);
    // Refresh gallery to update annotation counts
    setRefreshKey(prev => prev + 1);
  };

  const handleAnnotationsSaved = () => {
    // Refresh gallery to update annotation counts
    setRefreshKey(prev => prev + 1);
  };

  // Show loading state while context is initializing
  if (!isInitialized) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingParticles particleCount={30} />
        <div className="relative z-10">
          <LoadingSkeleton />
          <p className="text-center mt-4 text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <FloatingParticles particleCount={30} />
      
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Photo Annotation Studio
              </h1>
              <p className="text-muted-foreground mt-1">
                Select an image to start annotating. Click and drag to create annotations.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>{filteredImages.length} images</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <AnimatedFilter
              options={categories.map(cat => ({ 
                value: cat, 
                label: cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="sm:w-48"
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <AnnotationImageCard
              key={`${image.id}-${refreshKey}`} // Force re-render when refreshKey changes
              image={image}
              onClick={handleImageClick}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Annotation Modal */}
      <AnnotationModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={currentImageIndex > 0}
        hasNext={currentImageIndex < filteredImages.length - 1}
        onAnnotationsSaved={handleAnnotationsSaved}
      />
    </div>
  );
};

export default PhotoAnnotationGallery;
