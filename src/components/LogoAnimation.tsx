import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

interface LogoAnimationProps {
  onAnimationComplete?: () => void;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ onAnimationComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const logoControls = useAnimationControls();
  const textControls = useAnimationControls();
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    // sequence the logo animation
    const animateSequence = async () => {
      // initial logo morphing appearance
      await logoControls.start({
        scale: [0, 1],
        opacity: [0, 1],
        transition: { 
          duration: 1.5, 
          ease: [0.34, 1.56, 0.64, 1], // Custom spring-like bounce
          opacity: { duration: 0.8 }
        }
      });
      
      // text reveal with staggered characters
      await textControls.start({
        opacity: 1,
        transition: { duration: 0.6 }
      });
      
      // progress through loading steps
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAnimationStep(i + 1);
      }
      
      // complete animation
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 400);
      }
    };
    
    animateSequence();
  }, [logoControls, textControls, onAnimationComplete]);

  // text animation variants for staggered character animation
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-slate-950 to-gray-900">
        {/* removed particle background */}
        
        {/* main container with minimal design */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* logo with morphing animation */}
          <motion.div
            className="relative"
            animate={logoControls}
            initial={{ scale: 0, opacity: 0 }}
          >
            {/* minimalist geometric logo shape */}
            <svg 
             
            >
              {/* no outer ring - removed cylinder-like container */}
              
              {/* simple logo shape */}
              <motion.path
                d="M30 30L70 30L70 70L30 70L30 30Z" 
                fill="url(#logoGradient)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))" }}
              />
              
              {/* gradient definition */}
              <defs>
                <linearGradient id="logoGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          
          {/* loading text */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.p 
              className="text-blue-400 text-sm font-light tracking-wider"
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              Loading...
            </motion.p>
          </motion.div>
        </motion.div>
        
       
      </div>
    </AnimatePresence>
  );
};

export default LogoAnimation;
