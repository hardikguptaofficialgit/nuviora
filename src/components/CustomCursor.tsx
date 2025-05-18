
import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render the custom cursor on mobile devices
  if (isMobile) return null;

  return (
    <>
      <div 
        className={`custom-cursor ${clicked ? 'scale-75' : ''}`} 
        style={{ left: position.x, top: position.y }}
      />
      <div 
        className="custom-cursor-dot" 
        style={{ left: position.x, top: position.y }}
      />
    </>
  );
};

export default CustomCursor;
