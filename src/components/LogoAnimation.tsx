import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoAnimationProps {
  onAnimationComplete?: () => void;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ onAnimationComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    // Progress through animation steps
    if (animationStep < 3) {
      const timer = setTimeout(() => {
        setAnimationStep(prev => prev + 1);
      }, animationStep === 0 ? 800 : 600);
      
      return () => clearTimeout(timer);
    } else if (animationStep === 3 && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [animationStep, onAnimationComplete]);
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        {/* Background wave animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
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
                duration: 3,
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.img 
                src="/nuviora-logo-dark.png" 
                alt="NuviOra Logo"
                className="h-24 md:h-32"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>
            
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-bold neon-text tracking-tighter"
                initial={{ letterSpacing: '0.5em' }}
                animate={{ letterSpacing: '0.05em' }}
                transition={{ duration: 1.2, delay: 1 }}
              >
                NUVIORA
              </motion.h1>
              
              <motion.div
                className="mt-2 overflow-hidden h-6"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <motion.p 
                  className="text-sm md:text-md opacity-80"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                >
                  Advanced Biometric Monitoring
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Pulse ring animation */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`pulse-${i}`}
              className="absolute inset-0 rounded-full border border-neon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.2, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.4,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          ))}
          
          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-neon"
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: [-100, 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
        
        {/* Loading progress indicator */}
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className={`w-2 h-2 rounded-full ${i <= animationStep ? 'bg-neon' : 'bg-neon-dim'}`}
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ 
                  scale: i === animationStep ? [0.8, 1.2, 0.8] : 0.8,
                  opacity: i <= animationStep ? 1 : 0.5
                }}
                transition={{
                  duration: 0.6,
                  repeat: i === animationStep ? Infinity : 0,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoAnimation;
