import React, { useState, useEffect, useRef } from 'react';

const MasonryGrid = ({ 
  children, 
  columns = 4, 
  gap = 16,
  waterfallDelay = 100 
}) => {
  const [columnHeights, setColumnHeights] = useState([]);
  const [itemPositions, setItemPositions] = useState([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [layoutStable, setLayoutStable] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      setContainerWidth(containerRect.width);
      
      const columnWidth = (containerRect.width - gap * (columns - 1)) / columns;
      const heights = new Array(columns).fill(0);
      const positions = [];

      React.Children.forEach(children, (child, index) => {
        // Find the column with minimum height
        const minHeight = Math.min(...heights);
        const columnIndex = heights.indexOf(minHeight);
        
        // Calculate position
        const x = columnIndex * (columnWidth + gap);
        const y = heights[columnIndex];
        
        positions.push({
          x,
          y,
          width: columnWidth,
          delay: index * waterfallDelay
        });
        
        // Estimate item height (you can customize this)
        const estimatedHeight = 200 + Math.random() * 100;
        heights[columnIndex] += estimatedHeight + gap;
      });

      setColumnHeights(heights);
      setItemPositions(positions);
      
      // Only animate once on initial load, then lock the layout
      if (!hasAnimated) {
        setHasAnimated(true);
        // Set layout as stable immediately
        setLayoutStable(true);
      }
    };

    // Only calculate layout once
    if (!layoutStable) {
      updateLayout();
    }
    
    // COMPLETELY DISABLE RESIZE OBSERVER to prevent vibration
    // No resize handling to ensure absolute stability

    return () => {
      // No cleanup needed since no observers
    };
  }, [children, columns, gap]);

  const containerHeight = Math.max(...columnHeights, 0);

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: containerHeight }}
    >
      {React.Children.map(children, (child, index) => {
        const position = itemPositions[index];
        if (!position) return null;
        
        return (
          <div
            key={index}
            className="masonry-item"
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: position.width,
              opacity: 1,
              transform: 'none',
              transition: 'none',
              animation: 'none',
              willChange: 'auto'
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default MasonryGrid;
