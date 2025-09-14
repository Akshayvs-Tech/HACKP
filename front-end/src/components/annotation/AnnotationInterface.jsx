import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/Loading';
import AnimatedAnnotationCanvas from './AnimatedAnnotationCanvas';
import FloatingParticles from '../ui/FloatingParticles';
import { PenTool, Image as ImageIcon, Save, Download, Zap, Target } from 'lucide-react';
import { toast } from '../ui/Toast';

// Mock images for annotation
const mockImages = [
  {
    id: 1,
    title: 'Architecture Sample',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    annotations: [
      {
        id: 1,
        x: 100,
        y: 150,
        width: 200,
        height: 100,
        label: 'Building',
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        id: 2,
        x: 400,
        y: 250,
        width: 150,
        height: 120,
        label: 'Tree',
        createdAt: '2024-01-01T10:05:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Nature Scene',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    annotations: []
  },
  {
    id: 3,
    title: 'Urban Landscape',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    annotations: []
  }
];

// Mock API functions
const mockAnnotationAPI = {
  saveAnnotations: async (imageId, annotations) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Annotations saved successfully' };
  },
  
  loadAnnotations: async (imageId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const image = mockImages.find(img => img.id === imageId);
    return image ? image.annotations : [];
  }
};

const AnnotationInterface = () => {
  const [selectedImage, setSelectedImage] = useState(mockImages[0]);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    loadAnnotations();
  }, [selectedImage]);

  const loadAnnotations = async () => {
    setLoading(true);
    try {
      const loadedAnnotations = await mockAnnotationAPI.loadAnnotations(selectedImage.id);
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
      await mockAnnotationAPI.saveAnnotations(selectedImage.id, annotations);
      setHasUnsavedChanges(false);
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
      
      toast.success('Success', 'Annotations saved successfully');
    } catch (error) {
      toast.error('Error', 'Failed to save annotations');
    } finally {
      setSaving(false);
    }
  };

  const handleAnnotationCreate = (annotation) => {
    setAnnotations(prev => [...prev, annotation]);
    setHasUnsavedChanges(true);
  };

  const handleAnnotationUpdate = (updatedAnnotation) => {
    setAnnotations(prev => 
      prev.map(ann => ann.id === updatedAnnotation.id ? updatedAnnotation : ann)
    );
    setHasUnsavedChanges(true);
  };

  const handleAnnotationDelete = (annotationId) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
    setHasUnsavedChanges(true);
  };

  const exportAnnotations = () => {
    const exportData = {
      imageId: selectedImage.id,
      imageTitle: selectedImage.title,
      imageUrl: selectedImage.url,
      annotations: annotations,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations-${selectedImage.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Success', 'Annotations exported successfully');
  };

  return (
    <div className="space-y-6 relative">
      {/* Floating Particles Background */}
      <FloatingParticles particleCount={20} />
      
      {/* Header with animated tools */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <PenTool className={`h-6 w-6 transition-all duration-300 ${isAnnotationMode ? 'text-primary tool-active' : ''}`} />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Image Annotation
            </h2>
          </div>
          
          {/* Annotation mode toggle */}
          <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-lg p-2 border">
            <Button
              size="sm"
              variant={isAnnotationMode ? "default" : "outline"}
              onClick={() => setIsAnnotationMode(true)}
              className="tool-morph"
            >
              <Target className="h-4 w-4 mr-1" />
              Annotate
            </Button>
            <Button
              size="sm"
              variant={!isAnnotationMode ? "default" : "outline"}
              onClick={() => setIsAnnotationMode(false)}
              className="tool-morph"
            >
              <Zap className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600 dark:text-amber-400 animate-pulse">
              Unsaved changes
            </span>
          )}
          <Button
            onClick={saveAnnotations}
            loading={saving}
            disabled={!hasUnsavedChanges}
            className={`tool-morph ${showSuccessAnimation ? 'checkmark-bounce' : ''} ${hasUnsavedChanges ? 'glow-pulse' : ''}`}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Annotations
          </Button>
          <Button
            variant="outline"
            onClick={exportAnnotations}
            disabled={annotations.length === 0}
            className="tool-morph hover:tool-active"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Image Selector with enhanced animations */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-morphism animate-slide-left">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`
                    w-full p-3 text-left rounded-lg border transition-all duration-300 
                    ${selectedImage.id === image.id
                      ? 'bg-primary text-primary-foreground border-primary image-select-glow'
                      : 'bg-card hover:bg-accent border-border hover:border-primary/50'
                    }
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="font-medium text-sm">{image.title}</div>
                  <div className="text-xs opacity-70 flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>{image.annotations?.length || 0} annotations</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Annotation List */}
          <Card className="glass-morphism animate-slide-left">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Annotations ({annotations.length})</span>
                {annotations.length > 0 && (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <LoadingSkeleton key={i} className="h-8 image-shimmer" />
                  ))}
                </div>
              ) : annotations.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No annotations yet. Click and drag on the image to create one.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {annotations.map((annotation, index) => (
                    <div
                      key={annotation.id}
                      className="p-3 border rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-200 annotation-pulse"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="font-medium text-sm flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{annotation.label}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {annotation.width}×{annotation.height}px
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Annotation Canvas */}
        <div className="lg:col-span-3">
          <Card className="glass-morphism animate-slide-right">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>{selectedImage.title}</span>
                {isAnnotationMode && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Live Mode</span>
                  </div>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isAnnotationMode 
                  ? "Click and drag to create rectangular annotations. Use the controls to edit or delete existing annotations."
                  : "View mode: Browse annotations without editing. Switch to Annotate mode to make changes."
                }
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="relative">
                  <LoadingSkeleton className="w-full h-96 image-shimmer" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">Loading image...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatedAnnotationCanvas
                  imageUrl={selectedImage.url}
                  annotations={annotations}
                  onAnnotationCreate={handleAnnotationCreate}
                  onAnnotationUpdate={handleAnnotationUpdate}
                  onAnnotationDelete={handleAnnotationDelete}
                  isEditable={isAnnotationMode}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnnotationInterface;
