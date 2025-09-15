import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { toast } from '../ui/Toast';
import { Save, Edit3, Trash2, Check, X } from 'lucide-react';

const AnimatedAnnotationCanvas = ({ 
  imageUrl, 
  annotations = [], 
  onAnnotationCreate, 
  onAnnotationUpdate, 
  onAnnotationDelete,
  isEditable = true 
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelText, setLabelText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Handle image load
  const handleImageLoad = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (img && container) {
      setImageLoaded(true);
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      
      // Calculate displayed image dimensions based on object-contain behavior
      const containerRect = container.getBoundingClientRect();
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const containerAspectRatio = containerRect.width / containerRect.height;
      
      let displayWidth, displayHeight;
      
      if (imgAspectRatio > containerAspectRatio) {
        // Image is wider - fit to width
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imgAspectRatio;
      } else {
        // Image is taller - fit to height
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imgAspectRatio;
      }
      
      setContainerDimensions({
        width: displayWidth,
        height: displayHeight
      });
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (imageLoaded && imageRef.current && containerRef.current) {
        handleImageLoad(); // Recalculate dimensions
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded]);

  const getRelativeCoordinates = (e) => {
    const container = containerRef.current;
    if (!container || !imageLoaded || !containerDimensions.width) return { x: 0, y: 0 };
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculate image position within container (centered)
    const imageOffsetX = (containerRect.width - containerDimensions.width) / 2;
    const imageOffsetY = (containerRect.height - containerDimensions.height) / 2;
    
    // Get click position relative to container
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    
    // Adjust for image offset and scale to natural image size
    const relativeX = (clickX - imageOffsetX) / containerDimensions.width;
    const relativeY = (clickY - imageOffsetY) / containerDimensions.height;
    
    // Clamp to image bounds
    const clampedX = Math.max(0, Math.min(1, relativeX));
    const clampedY = Math.max(0, Math.min(1, relativeY));
    
    return {
      x: clampedX * imageDimensions.width,
      y: clampedY * imageDimensions.height
    };
  };

  const handleMouseDown = useCallback((e) => {
    if (!isEditable || !imageLoaded) return;
    
    const point = getRelativeCoordinates(e);
    setStartPoint(point);
    setIsDrawing(true);
    e.preventDefault();
  }, [isEditable, imageLoaded, imageDimensions]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !startPoint || !imageLoaded) return;
    
    const point = getRelativeCoordinates(e);
    setCurrentRect({
      x: Math.min(startPoint.x, point.x),
      y: Math.min(startPoint.y, point.y),
      width: Math.abs(point.x - startPoint.x),
      height: Math.abs(point.y - startPoint.y)
    });
  }, [isDrawing, startPoint, imageLoaded]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentRect || !imageLoaded) return;
    
    // Only create annotation if rectangle has meaningful size
    if (currentRect.width > 20 && currentRect.height > 20) {
      setShowLabelModal(true);
    } else {
      setCurrentRect(null);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, currentRect, imageLoaded]);

  const handleSaveAnnotation = () => {
    if (!currentRect || !labelText.trim()) {
      toast.error('Error', 'Please provide a label for the annotation');
      return;
    }

    const annotation = {
      id: Date.now(),
      x: currentRect.x,
      y: currentRect.y,
      width: currentRect.width,
      height: currentRect.height,
      label: labelText.trim(),
      createdAt: new Date().toISOString()
    };

    onAnnotationCreate?.(annotation);
    
    // Reset state
    setCurrentRect(null);
    setLabelText('');
    setShowLabelModal(false);
    
    toast.success('Success', 'Annotation created successfully');
  };

  const handleEditAnnotation = (annotation) => {
    setSelectedAnnotation(annotation);
    setLabelText(annotation.label);
    setShowLabelModal(true);
  };

  const handleUpdateAnnotation = () => {
    if (!selectedAnnotation || !labelText.trim()) {
      toast.error('Error', 'Please provide a valid label');
      return;
    }

    const updatedAnnotation = {
      ...selectedAnnotation,
      label: labelText.trim(),
      updatedAt: new Date().toISOString()
    };

    onAnnotationUpdate?.(updatedAnnotation);
    
    // Reset state
    setSelectedAnnotation(null);
    setLabelText('');
    setShowLabelModal(false);
    
    toast.success('Success', 'Annotation updated successfully');
  };

  const handleDeleteAnnotation = (annotation) => {
    if (window.confirm('Are you sure you want to delete this annotation?')) {
      onAnnotationDelete?.(annotation.id);
      toast.success('Success', 'Annotation deleted successfully');
    }
  };

  const closeModal = () => {
    setShowLabelModal(false);
    setSelectedAnnotation(null);
    setLabelText('');
    setCurrentRect(null);
  };

  // Handle keyboard events for modal
  useEffect(() => {
    const handleModalKeyDown = (e) => {
      if (!showLabelModal) return;
      
      if (e.key === 'Enter' && labelText.trim()) {
        e.preventDefault();
        if (selectedAnnotation) {
          handleUpdateAnnotation();
        } else {
          handleSaveAnnotation();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    document.addEventListener('keydown', handleModalKeyDown);
    return () => document.removeEventListener('keydown', handleModalKeyDown);
  }, [showLabelModal, labelText, selectedAnnotation]);

  const renderAnnotation = (annotation) => {
    if (!containerDimensions.width || !imageDimensions.width) return null;

    const container = containerRef.current;
    if (!container) return null;
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculate image position within container (centered)
    const imageOffsetX = (containerRect.width - containerDimensions.width) / 2;
    const imageOffsetY = (containerRect.height - containerDimensions.height) / 2;
    
    const scaleX = containerDimensions.width / imageDimensions.width;
    const scaleY = containerDimensions.height / imageDimensions.height;

    const style = {
      position: 'absolute',
      left: imageOffsetX + (annotation.x * scaleX),
      top: imageOffsetY + (annotation.y * scaleY),
      width: annotation.width * scaleX,
      height: annotation.height * scaleY,
      border: '3px solid rgb(59 130 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      borderRadius: '6px',
      cursor: isEditable ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    };

    return (
      <div
        key={annotation.id}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          if (isEditable) {
            handleEditAnnotation(annotation);
          }
        }}
        className="group hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-lg"
      >
        {/* Enhanced Label with better visibility and larger text */}
        <div 
          className="absolute -top-12 left-0 pointer-events-none z-10"
          style={{ 
            fontSize: '14px',
            minWidth: 'max-content',
            maxWidth: '200px'
          }}
        >
          <div className="bg-black/90 text-white px-4 py-2 rounded-lg shadow-xl backdrop-blur-sm border-2 border-white/30">
            <div className="font-semibold text-white drop-shadow-sm">{annotation.label}</div>
          </div>
          {/* Arrow pointing to annotation */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-black/90"></div>
        </div>
        
        {/* Delete button */}
        {isEditable && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAnnotation(annotation);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  const renderCurrentRect = () => {
    if (!currentRect || !containerDimensions.width || !imageDimensions.width) return null;

    const container = containerRef.current;
    if (!container) return null;
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculate image position within container (centered)
    const imageOffsetX = (containerRect.width - containerDimensions.width) / 2;
    const imageOffsetY = (containerRect.height - containerDimensions.height) / 2;

    const scaleX = containerDimensions.width / imageDimensions.width;
    const scaleY = containerDimensions.height / imageDimensions.height;

    const style = {
      position: 'absolute',
      left: imageOffsetX + (currentRect.x * scaleX),
      top: imageOffsetY + (currentRect.y * scaleY),
      width: currentRect.width * scaleX,
      height: currentRect.height * scaleY,
      border: '2px dashed rgb(34 197 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderRadius: '4px',
      pointerEvents: 'none',
    };

    return <div style={style} />;
  };

  return (
    <div className="space-y-4">
      {/* Image Container - No borders */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center overflow-hidden rounded-lg bg-transparent"
        style={{ 
          minHeight: '400px',
          maxHeight: '80vh',
          cursor: isEditable ? 'crosshair' : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDrawing) {
            setIsDrawing(false);
            setCurrentRect(null);
            setStartPoint(null);
          }
        }}
      >
        {/* Main Image */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Annotation target"
          className="max-w-full max-h-[75vh] object-contain shadow-2xl rounded-lg"
          onLoad={handleImageLoad}
          onError={(e) => {
            console.error('Failed to load image:', e);
            toast.error('Error', 'Failed to load image');
          }}
          draggable={false}
        />

        {/* Existing Annotations */}
        {imageLoaded && annotations.map(renderAnnotation)}

        {/* Current Drawing Rectangle */}
        {imageLoaded && renderCurrentRect()}

        {/* Loading overlay */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {imageLoaded && isEditable && (
        <div className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
          Click and drag on the image to create rectangular annotations. Click on existing annotations to edit them.
        </div>
      )}

      {/* Label Modal */}
      <Modal isOpen={showLabelModal} onClose={closeModal}>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
            {selectedAnnotation ? 'Edit Annotation' : 'Add Annotation Label'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Annotation Label
              </label>
              <Input
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder="Enter label for this annotation..."
                className="w-full text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && labelText.trim()) {
                    e.preventDefault();
                    selectedAnnotation ? handleUpdateAnnotation() : handleSaveAnnotation();
                  }
                }}
              />
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button 
                onClick={selectedAnnotation ? handleUpdateAnnotation : handleSaveAnnotation}
                disabled={!labelText.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedAnnotation ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnimatedAnnotationCanvas;

