import React from 'react';
import { motion, Variant, Variants } from 'framer-motion';

type AnimationType = 
  | 'fadeIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scale' 
  | 'pulse' 
  | 'bounce' 
  | 'rotate' 
  | 'glow';

interface AnimatedElementProps {
  children: React.ReactNode;
  type: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  repeat?: number | boolean;
  hover?: boolean;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  type,
  delay = 0,
  duration = 0.5,
  className = '',
  repeat = false,
  hover = false
}) => {
  const getAnimationVariants = (): Variants => {
    const variants: Record<string, Variants> = {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      },
      slideUp: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      },
      slideDown: {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 }
      },
      slideLeft: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
      },
      slideRight: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
      },
      scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      },
      pulse: {
        hidden: { opacity: 0.8, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: [0.95, 1.05, 0.95],
          transition: {
            scale: {
              repeat: repeat === true ? Infinity : repeat,
              repeatType: 'reverse',
              duration: duration * 2
            }
          }
        }
      },
      bounce: {
        hidden: { opacity: 0, y: 0 },
        visible: { 
          opacity: 1, 
          y: [0, -20, 0],
          transition: {
            y: {
              repeat: repeat === true ? Infinity : repeat,
              repeatType: 'reverse',
              duration: duration * 2
            }
          }
        }
      },
      rotate: {
        hidden: { opacity: 0, rotate: -90 },
        visible: { 
          opacity: 1, 
          rotate: repeat ? [0, 360] : 0,
          transition: {
            rotate: {
              repeat: repeat === true ? Infinity : repeat,
              repeatType: 'loop',
              duration: duration * 3
            }
          }
        }
      },
      glow: {
        hidden: { 
          opacity: 0.8,
          boxShadow: '0 0 0px rgba(190, 234, 158, 0)'
        },
        visible: { 
          opacity: 1,
          boxShadow: [
            '0 0 0px rgba(190, 234, 158, 0)',
            '0 0 20px rgba(190, 234, 158, 0.7)',
            '0 0 0px rgba(190, 234, 158, 0)'
          ],
          transition: {
            boxShadow: {
              repeat: repeat === true ? Infinity : repeat,
              repeatType: 'loop',
              duration: duration * 3
            }
          }
        }
      }
    };

    return variants[type] || variants.fadeIn;
  };

  const getHoverVariants = (): Variant => {
    if (!hover) return {};

    const hoverVariants: Record<string, Variant> = {
      fadeIn: { opacity: 0.8 },
      slideUp: { y: -10 },
      slideDown: { y: 10 },
      slideLeft: { x: -10 },
      slideRight: { x: 10 },
      scale: { scale: 1.1 },
      pulse: { scale: 1.05 },
      bounce: { y: -10 },
      rotate: { rotate: 5 },
      glow: { boxShadow: '0 0 15px rgba(190, 234, 158, 0.7)' }
    };

    return hoverVariants[type] || {};
  };

  const variants = getAnimationVariants();
  const hoverVariant = getHoverVariants();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      variants={{
        ...variants,
        hover: hoverVariant
      }}
      transition={{
        duration,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 10
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
