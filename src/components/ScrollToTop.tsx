import React, { useState, useEffect } from 'react';
import { ChevronUp, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToTop } from '@/utils/scrollUtils';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) { // Lower threshold to show button earlier
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleClick = () => {
    scrollToTop(800); // Smooth scroll to top with 800ms duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          {/* Pulsing background effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-neon/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.button
            onClick={handleClick}
            className="relative p-5 rounded-full bg-neon text-black hover:bg-neon/90 transition-colors shadow-[0_0_20px_rgba(190,234,158,0.6)]"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(190, 234, 158, 0.9)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={28} className="stroke-[2.5px]" />
            <span className="sr-only">Back to top</span>
          </motion.button>
          
          {/* Text label */}
          <motion.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-neon text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Back to top
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
