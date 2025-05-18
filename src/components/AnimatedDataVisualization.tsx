import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedDataVisualizationProps {
  data: number[];
  height?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

const AnimatedDataVisualization: React.FC<AnimatedDataVisualizationProps> = ({
  data,
  height = 100,
  color = 'var(--neon)',
  className = '',
  animated = true
}) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <div 
      className={`flex items-end space-x-1 ${className}`}
      style={{ height: `${height}px` }}
    >
      {data.map((value, index) => {
        const barHeight = (value / maxValue) * 100;
        
        return (
          <motion.div
            key={index}
            className="flex-1 rounded-t-sm"
            style={{ 
              backgroundColor: color,
              height: animated ? 0 : `${barHeight}%`,
              opacity: 0.7
            }}
            animate={animated ? { 
              height: `${barHeight}%`,
              opacity: [0.3, 0.7, 0.5, 0.7]
            } : {}}
            transition={{
              height: { 
                duration: 0.8,
                delay: index * 0.05,
                ease: "easeOut"
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedDataVisualization;
