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
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 card-lift backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 hover:border-blue-400"
      onClick={() => onClick(image)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        {!isLoaded && (
          <EnhancedShimmer variant="gallery" className="absolute inset-0" />
        )}
        <img
          src={image.thumbnail}
          alt={image.title}
          onLoad={() => setIsLoaded(true)}
          className={clsx(
            "w-full h-full object-cover transition-all duration-300",
            isHovered ? "scale-110" : "scale-100",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
        
        {/* Enhanced overlay with annotation info and smooth animations */}
        <div className={clsx(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center transition-all duration-500 ease-out",
          isHovered ? "opacity-100 backdrop-blur-sm" : "opacity-0"
        )}>
          <div className={clsx(
            "text-center text-white transition-all duration-300",
            isHovered ? "transform translate-y-0 scale-100" : "transform translate-y-4 scale-95"
          )}>
            <div className="bg-white/20 rounded-full p-3 mb-3 backdrop-blur-md">
              <PenTool className="h-6 w-6 mx-auto" />
            </div>
            <p className="text-sm font-medium drop-shadow-lg">Click to Annotate</p>
            <p className="text-xs opacity-90 mt-1">Create and manage annotations</p>
          </div>
        </div>

        {/* Annotation count badge */}
        {actualAnnotationCount > 0 && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {actualAnnotationCount} annotations
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{image.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="capitalize">{image.category}</span>
          <span>{new Date(image.lastModified).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
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
  const { theme } = useTheme();
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

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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

  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className={theme === 'light' ? 'bg-white/95 backdrop-blur-xl border-0' : 'bg-black/90 backdrop-blur-xl border-0'}
      showCloseButton={false}
    >
      <div className="relative flex items-center justify-center min-h-screen p-4">
        {/* Theme-aware glassmorphism overlay */}
        <div className={`absolute inset-0 backdrop-blur-2xl ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-white/40 via-white/20 to-white/10' 
            : 'bg-gradient-to-br from-black/40 via-black/20 to-black/10'
        }`}></div>
        
        {/* Clean minimalist close button - no background, just enlarges on hover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={`absolute top-6 right-6 z-50 bg-transparent hover:bg-transparent border-none transition-all duration-300 group p-2 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}
          title="Close"
        >
          <X className="h-6 w-6 transition-transform duration-300 group-hover:scale-150 drop-shadow-lg" />
        </Button>

        {/* Annotation functionality with glassmorphism */}
        {loading ? (
          <div className="flex items-center justify-center z-10">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-6xl">
            {/* Annotation Canvas with glass effect */}
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
              <AnimatedAnnotationCanvas
                imageUrl={image.url}
                annotations={annotations}
                onAnnotationCreate={handleAnnotationCreate}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationDelete={handleAnnotationDelete}
                isEditable={isAnnotationMode}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
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
    if (isInitialized) {
      console.log('PhotoAnnotationGallery: Loading images, uploaded count:', uploadedImages.length);
      const images = getAllImages(true); // Include mock images
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
