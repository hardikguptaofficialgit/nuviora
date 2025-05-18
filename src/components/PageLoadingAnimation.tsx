import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoadingAnimationProps {
  onAnimationComplete?: () => void;
  duration?: number; // Duration in milliseconds
}

const PageLoadingAnimation: React.FC<PageLoadingAnimationProps> = ({ 
  onAnimationComplete,
  duration = 2000 // Default 2 seconds
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* minimal logo and loading text */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <motion.img 
              src="/nuviora-logo-dark.png" 
              alt="NuviOra Logo"
              className="h-20 md:h-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoadingAnimation;
