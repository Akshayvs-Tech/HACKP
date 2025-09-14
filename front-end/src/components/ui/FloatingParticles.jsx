import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const FloatingParticles = ({ particleCount = 50 }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';
    particlesRef.current = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle animate-particle-float';
      
      // Random size between 2-8px
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      
      // Add glow effect for dark theme
      if (theme === 'dark') {
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(147, 51, 234, 0.3)`;
      }
      
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }

    // Create connecting lines between nearby particles
    const createConnectingLines = () => {
      const lines = container.querySelectorAll('.connecting-line');
      lines.forEach(line => line.remove());

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const particle1 = particlesRef.current[i];
          const particle2 = particlesRef.current[j];
          
          const rect1 = particle1.getBoundingClientRect();
          const rect2 = particle2.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          const x1 = rect1.left - containerRect.left + rect1.width / 2;
          const y1 = rect1.top - containerRect.top + rect1.height / 2;
          const x2 = rect2.left - containerRect.left + rect2.width / 2;
          const y2 = rect2.top - containerRect.top + rect2.height / 2;
          
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          // Only create lines between particles within 150px
          if (distance < 150) {
            const line = document.createElement('div');
            line.className = 'connecting-line';
            
            const length = distance;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            
            line.style.width = `${length}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}rad)`;
            line.style.transformOrigin = '0 0';
            line.style.opacity = Math.max(0.1, 1 - distance / 150);
            
            container.appendChild(line);
          }
        }
      }
    };

    // Update connecting lines periodically
    const lineInterval = setInterval(createConnectingLines, 2000);
    
    // Initial line creation
    setTimeout(createConnectingLines, 1000);

    return () => {
      clearInterval(lineInterval);
    };
  }, [particleCount, theme]);

  return (
    <div 
      ref={containerRef}
      className="floating-particles particle-container fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default FloatingParticles;
