import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { PenTool, Upload, Grid, Search, Filter, Download, Play } from 'lucide-react';

const PhotoAnnotationGallery = () => {
  const [images] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-modern py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="heading-1 mb-6 gradient-text">
            Photo Annotation Studio
          </h1>
          <p className="body-large text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create precise annotations on your images with our professional-grade annotation tools.
            Enhance your machine learning datasets with pixel-perfect accuracy.
          </p>
        </div>

        {/* Controls Section */}
        <div className="card-modern mb-8 slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="objects">Objects</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="people">People</option>
                  <option value="nature">Nature</option>
                </select>

                <Button className="btn-ghost">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button 
                  className={viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="card-interactive slide-up">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="heading-6 mb-2">Upload Images</h3>
              <p className="body-small text-gray-500 mb-4">
                Add new images to start annotating
              </p>
              <Button className="btn-primary w-full">
                Choose Files
              </Button>
            </CardContent>
          </Card>

          <Card className="card-interactive slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="heading-6 mb-2">Start Annotating</h3>
              <p className="body-small text-gray-500 mb-4">
                Begin creating precise annotations
              </p>
              <Button className="btn-primary w-full">
                Open Studio
              </Button>
            </CardContent>
          </Card>

          <Card className="card-interactive slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="heading-6 mb-2">Export Dataset</h3>
              <p className="body-small text-gray-500 mb-4">
                Download your annotated dataset
              </p>
              <Button className="btn-secondary w-full">
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <Card className="card-modern text-center py-16 slide-up" style={{ animationDelay: '0.3s' }}>
          <CardContent>
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Play className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="heading-2 mb-6 gradient-text">
                Advanced Annotation Tools Coming Soon
              </h2>
              
              <p className="body-large text-gray-600 dark:text-gray-400 mb-8">
                We're building the most powerful and intuitive annotation platform for computer vision projects. 
                Our advanced tools will revolutionize how you create and manage image datasets.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <PenTool className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="heading-6 mb-2">Smart Annotations</h4>
                  <p className="body-small text-gray-500">
                    AI-powered annotation suggestions
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Grid className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="heading-6 mb-2">Batch Processing</h4>
                  <p className="body-small text-gray-500">
                    Annotate multiple images simultaneously
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="heading-6 mb-2">Export Formats</h4>
                  <p className="body-small text-gray-500">
                    Support for COCO, YOLO, and more
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-primary">
                  Get Early Access
                </Button>
                <Button className="btn-secondary">
                  Watch Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-12 text-center slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="body-small font-medium text-gray-700 dark:text-gray-300">
                Development Progress
              </span>
              <span className="body-small text-gray-500">85%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: '85%' }}
              ></div>
            </div>
            <p className="caption text-gray-500 mt-2">
              Expected launch: Q2 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoAnnotationGallery;
      annotations: [],
      picId: picId // Store the picsum ID for reference
    };
  });
};

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
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render of cards

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
  }, [selectedCategory, searchTerm, images, refreshKey]);

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
