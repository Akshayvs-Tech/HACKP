import React, { useState, useRef, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { toast } from '../ui/Toast';
import { Save, Edit3, Trash2, Plus } from 'lucide-react';
import { clsx } from 'clsx';

const AnnotationCanvas = ({ 
  imageUrl, 
  annotations = [], 
  onAnnotationCreate, 
  onAnnotationUpdate, 
  onAnnotationDelete,
  isEditable = true 
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelText, setLabelText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const getRelativeCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * imageDimensions.width,
      y: ((e.clientY - rect.top) / rect.height) * imageDimensions.height
    };
  };

  const handleMouseDown = useCallback((e) => {
    if (!isEditable || !imageLoaded) return;
    
    const point = getRelativeCoordinates(e);
    setStartPoint(point);
    setIsDrawing(true);
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
  }, [isDrawing, startPoint, imageDimensions, imageLoaded]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentRect || !imageLoaded) return;
    
    // Only create annotation if rectangle has meaningful size
    if (currentRect.width > 10 && currentRect.height > 10) {
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
    toast.success('Success', 'Annotation created successfully');
    
    // Reset state
    setCurrentRect(null);
    setLabelText('');
    setShowLabelModal(false);
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
    toast.success('Success', 'Annotation updated successfully');
    
    // Reset state
    setSelectedAnnotation(null);
    setLabelText('');
    setShowLabelModal(false);
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

  const renderAnnotation = (annotation, index) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / imageDimensions.width;
    const scaleY = rect.height / imageDimensions.height;

    const style = {
      position: 'absolute',
      left: annotation.x * scaleX,
      top: annotation.y * scaleY,
      width: annotation.width * scaleX,
      height: annotation.height * scaleY,
    };

    return (
      <div key={annotation.id} className="annotation-group">
        {/* Rectangle */}
        <div
          style={style}
          className="border-2 border-primary bg-primary/10 pointer-events-none"
        />
        
        {/* Label */}
        <div
          style={{
            position: 'absolute',
            left: annotation.x * scaleX,
            top: (annotation.y - 25) * scaleY,
          }}
          className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded pointer-events-none max-w-32 truncate"
        >
          {annotation.label}
        </div>
        
        {/* Controls */}
        {isEditable && (
          <div
            style={{
              position: 'absolute',
              left: (annotation.x + annotation.width - 60) * scaleX,
              top: (annotation.y - 25) * scaleY,
            }}
            className="flex space-x-1"
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6"
              onClick={() => handleEditAnnotation(annotation)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6"
              onClick={() => handleDeleteAnnotation(annotation)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentRect = () => {
    if (!currentRect || !imageLoaded) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / imageDimensions.width;
    const scaleY = rect.height / imageDimensions.height;

    const style = {
      position: 'absolute',
      left: currentRect.x * scaleX,
      top: currentRect.y * scaleY,
      width: currentRect.width * scaleX,
      height: currentRect.height * scaleY,
    };

    return (
      <div
        style={style}
        className="border-2 border-dashed border-primary bg-primary/20 pointer-events-none"
      />
    );
  };

  return (
    <div className="relative">
      <div className="relative inline-block">
        <img
          ref={canvasRef}
          src={imageUrl}
          alt="Annotation target"
          className="max-w-full h-auto border rounded-lg"
          onLoad={(e) => {
            setImageLoaded(true);
            setImageDimensions({
              width: e.target.naturalWidth,
              height: e.target.naturalHeight
            });
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: isEditable ? 'crosshair' : 'default' }}
        />
        
        {/* Existing annotations */}
        {annotations.map((annotation, index) => renderAnnotation(annotation, index))}
        
        {/* Current drawing rectangle */}
        {renderCurrentRect()}
      </div>

      {/* Label Modal */}
      <Modal
        isOpen={showLabelModal}
        onClose={closeModal}
        title={selectedAnnotation ? 'Edit Annotation' : 'Add Label'}
      >
        <div className="space-y-4">
          <Input
            label="Annotation Label"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            placeholder="Enter a description for this area..."
            autoFocus
          />
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button 
              onClick={selectedAnnotation ? handleUpdateAnnotation : handleSaveAnnotation}
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedAnnotation ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnnotationCanvas;
