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
          {/* Background wave animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute bottom-0 left-0 right-0 h-[20vh] bg-neon-dim"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ 
                  y: ['100%', '0%', '-100%'],
                  opacity: [0, 0.2, 0],
                  scaleY: [1, 1.5, 1]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                style={{
                  borderRadius: "50% 50% 0 0",
                  height: `${(i + 1) * 10}vh`,
                  filter: "blur(10px)"
                }}
              />
            ))}
          </div>
          
          {/* Logo animation */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.img 
                src="/nuviora-logo-dark.png" 
                alt="NuviOra Logo"
                className="h-20 md:h-24"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              
              <motion.h1 
                className="mt-4 text-2xl md:text-3xl font-bold neon-text tracking-tighter"
                initial={{ letterSpacing: '0.3em', opacity: 0 }}
                animate={{ letterSpacing: '0.05em', opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                LOADING
              </motion.h1>
            </motion.div>
            
            {/* Pulse ring animation */}
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute inset-0 rounded-full border border-neon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.5, 2],
                  opacity: [0.6, 0.2, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            ))}
            
            {/* Scan line animation */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-neon"
              initial={{ y: -50, opacity: 0 }}
              animate={{ 
                y: [-50, 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
          
          {/* Loading dots */}
          <motion.div 
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="w-2 h-2 rounded-full bg-neon"
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoadingAnimation;
