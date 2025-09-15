import React, { createContext, useContext, useState, useEffect } from 'react';

const ImageContext = createContext();

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Track if localStorage has been loaded

  // Load uploaded images from localStorage on mount
  useEffect(() => {
    const loadImages = () => {
      try {
        const saved = localStorage.getItem('uploadedImages');
        console.log('ImageContext: Checking localStorage for key "uploadedImages"');
        console.log('ImageContext: Raw localStorage value:', saved);
        
        if (saved) {
          const parsedImages = JSON.parse(saved);
          console.log('ImageContext: Successfully parsed', parsedImages.length, 'images from localStorage');
          console.log('ImageContext: Loaded images:', parsedImages.map(img => ({ id: img.id, title: img.title })));
          setUploadedImages(parsedImages);
        } else {
          console.log('ImageContext: No images found in localStorage');
        }
      } catch (error) {
        console.error('ImageContext: Error loading uploaded images:', error);
      } finally {
        setIsInitialized(true);
        console.log('ImageContext: Initialization complete');
      }
    };

    loadImages();
  }, []);

  // Save uploaded images to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      console.log('ImageContext: Saving to localStorage:', uploadedImages.length, 'images');
      console.log('ImageContext: Images being saved:', uploadedImages.map(img => ({ id: img.id, title: img.title })));
      localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
      console.log('ImageContext: Save complete');
    }
  }, [uploadedImages, isInitialized]);

  const addUploadedImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type'));
        return;
      }

      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          url: e.target.result, // Base64 data URL
          thumbnail: e.target.result,
          description: `Uploaded image: ${file.name}`,
          category: 'uploaded',
          likes: 0,
          views: 0,
          tags: ['uploaded', 'user-content'],
          annotationCount: 0,
          lastModified: new Date().toISOString(),
          fileSize: file.size,
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          isUploaded: true
        };

        setUploadedImages(prev => [imageData, ...prev]);
        setIsLoading(false);
        resolve(imageData);
      };

      reader.onerror = () => {
        setIsLoading(false);
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const getAllImages = (includeMockImages = true) => {
    const images = [...uploadedImages];
    
    if (includeMockImages) {
      // Add mock images (you can customize this based on which component needs them)
      const mockImages = generateMockImages();
      images.push(...mockImages);
    }
    
    return images;
  };

  const getUploadedImages = () => {
    return uploadedImages;
  };

  const getImageById = (imageId) => {
    return uploadedImages.find(img => img.id === imageId);
  };

  const value = {
    uploadedImages,
    isLoading,
    isInitialized,
    addUploadedImage,
    removeUploadedImage,
    getAllImages,
    getUploadedImages,
    getImageById
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

// Helper function to generate mock images (moved here for reusability)
const generateMockImages = (count = 20) => {
  const categories = ['nature', 'architecture', 'people', 'technology', 'abstract'];
  const imageIds = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  
  return Array.from({ length: count }, (_, i) => {
    const imageId = imageIds[i] || (i + 1);
    const imageUrl = `https://picsum.photos/id/${imageId}/800/600`;
    return {
      id: `mock_${i + 1}`,
      title: `Photo ${i + 1}`,
      url: imageUrl,
      thumbnail: imageUrl,
      description: `A beautiful photo captured at location ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      likes: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 1000),
      tags: ['photo', 'gallery', categories[Math.floor(Math.random() * categories.length)]],
      annotationCount: Math.floor(Math.random() * 5),
      lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      isUploaded: false
    };
  });
};

export default ImageProvider;
