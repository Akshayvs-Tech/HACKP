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

// Mock image data for annotation
const generateAnnotationImages = (count = 20) => {
  const categories = ['architecture', 'nature', 'urban', 'people', 'objects'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Photo ${i + 1}`,
    url: `https://picsum.photos/800/600?random=${i + 1}`,
    thumbnail: `https://picsum.photos/400/300?random=${i + 1}`,
    description: `Photo for annotation - ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    annotationCount: Math.floor(Math.random() * 5),
    lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    annotations: []
  }));
};

// Mock API functions
const mockAnnotationAPI = {
  saveAnnotations: async (imageId, annotations) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Annotations saved successfully' };
  },
  
  loadAnnotations: async (imageId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return some mock annotations for the first few images
    if (imageId <= 3) {
      return [
        {
          id: 1,
          x: 100,
          y: 150,
          width: 200,
          height: 100,
          label: 'Object 1',
          createdAt: new Date().toISOString()
        }
      ];
    }
    return [];
  }
};

const AnnotationImageCard = ({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 card-lift"
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
        
        {/* Overlay with annotation info */}
        <div className={clsx(
          "absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-center text-white">
            <PenTool className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Click to Annotate</p>
          </div>
        </div>

        {/* Annotation count badge */}
        {image.annotationCount > 0 && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {image.annotationCount} annotations
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
  hasNext 
}) => {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);

  useEffect(() => {
    if (image && isOpen) {
      loadAnnotations();
    }
  }, [image, isOpen]);

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

  const loadAnnotations = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      const loadedAnnotations = await mockAnnotationAPI.loadAnnotations(image.id);
      setAnnotations(loadedAnnotations);
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Error', 'Failed to load annotations');
    } finally {
      setLoading(false);
    }
  };

  const saveAnnotations = async () => {
    setSaving(true);
    try {
      await mockAnnotationAPI.saveAnnotations(image.id, annotations);
      setHasUnsavedChanges(false);
      toast.success('Success', 'Annotations saved successfully');
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
      className="bg-background"
      showCloseButton={false}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">{image.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{annotations.length} annotations</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Navigation */}
            {hasPrevious && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            )}
            
            {hasNext && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNext}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {/* Save button */}
            <Button
              onClick={saveAnnotations}
              disabled={!hasUnsavedChanges || saving}
              size="sm"
              className="flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </Button>

            {/* Toggle annotation mode */}
            <Button
              variant={isAnnotationMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAnnotationMode(!isAnnotationMode)}
              className="flex items-center space-x-1"
            >
              <PenTool className="h-4 w-4" />
              <span>{isAnnotationMode ? 'Annotating' : 'Viewing'}</span>
            </Button>

            {/* Close button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Annotation Canvas */}
        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSkeleton />
            </div>
          ) : (
            <AnimatedAnnotationCanvas
              imageUrl={image.url}
              annotations={annotations}
              onAnnotationCreate={handleAnnotationCreate}
              onAnnotationUpdate={handleAnnotationUpdate}
              onAnnotationDelete={handleAnnotationDelete}
              isEditable={isAnnotationMode}
            />
          )}
        </div>

        {/* Unsaved changes indicator */}
        {hasUnsavedChanges && (
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 border-t">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
              You have unsaved changes. Don't forget to save your annotations!
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

const PhotoAnnotationGallery = () => {
  const [images] = useState(generateAnnotationImages(20));
  const [filteredImages, setFilteredImages] = useState(images);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['all', ...new Set(images.map(img => img.category))];

  useEffect(() => {
    let filtered = images;

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
  }, [selectedCategory, searchTerm, images]);

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
              key={image.id}
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
      />
    </div>
  );
};

export default PhotoAnnotationGallery;
