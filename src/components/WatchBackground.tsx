import React, { useEffect, useState } from 'react';

interface WatchPosition {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  opacity: number;
  delay: number;
}

const WatchBackground: React.FC = () => {
  const [watches, setWatches] = useState<WatchPosition[]>([]);
  
  useEffect(() => {
    // Generate random watch positions
    const generateWatches = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const watchCount = Math.floor((windowWidth * windowHeight) / 8000); // Increased density
      
      const newWatches: WatchPosition[] = [];
      
      for (let i = 0; i < watchCount; i++) {
        newWatches.push({
          id: i,
          x: Math.random() * 100, // Random x position (percentage)
          y: Math.random() * 100, // Random y position (percentage)
          size: Math.random() * 16 + 16, // Random size between 16-32px (larger)
          speed: Math.random() * 40 + 20, // Random speed for animation
          rotation: Math.random() * 360, // Random initial rotation
          opacity: Math.random() * 0.2 + 0.15, // Random opacity between 0.15-0.35 (more visible)
          delay: Math.random() * -20 // Random delay for staggered animation
        });
      }
      
      setWatches(newWatches);
    };
    
    generateWatches();
    
    // Regenerate watches on window resize
    window.addEventListener('resize', generateWatches);
    
    return () => {
      window.removeEventListener('resize', generateWatches);
    };
  }, []);
  
  // Create static watch elements in addition to floating ones
  const renderStaticWatches = () => {
    const staticWatches = [];
    const count = 30; // Number of static watches
    
    for (let i = 0; i < count; i++) {
      staticWatches.push(
        <div
          key={`static-${i}`}
          className="static-watch"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 12 + 12}px`,
            height: `${Math.random() * 12 + 12}px`,
            opacity: Math.random() * 0.3 + 0.1,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      );
    }
    
    return staticWatches;
  };
  
  return (
    <div className="watch-bg">
      {renderStaticWatches()}
      {watches.map((watch) => (
        <div
          key={watch.id}
          className="floating-watch"
          style={{
            left: `${watch.x}%`,
            top: `${watch.y}%`,
            width: `${watch.size}px`,
            height: `${watch.size}px`,
            opacity: watch.opacity,
            animationDuration: `${watch.speed}s`,
            transform: `rotate(${watch.rotation}deg)`,
            animationDelay: `${watch.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default WatchBackground;
