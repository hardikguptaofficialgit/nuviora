import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ScribbleLineProps {
  color?: string;
  width?: number;
  className?: string;
  type?: 'scribble' | 'heartbeat';
}

const ScribbleLine: React.FC<ScribbleLineProps> = ({ 
  color = '#BEEA9E', 
  width = 180, 
  className = '',
  type = 'heartbeat'
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [path, setPath] = useState<string>('');
  
  // Generate a random scribble path
  const generateScribblePath = () => {
    const length = width;
    const amplitude = 5; // Height of the waves
    const segments = 10; // Number of segments in the path
    
    let path = `M0,0 `;
    
    for (let i = 1; i <= segments; i++) {
      const x = (length / segments) * i;
      const y = (Math.random() * amplitude * 2) - amplitude;
      path += `L${x},${y} `;
    }
    
    return path;
  };
  
  // Generate a heartbeat/EKG path
  const generateHeartbeatPath = () => {
    const length = width;
    const baseY = 10; // Baseline position
    
    // EKG pattern: flat line, small bump, big spike, small bump, flat line
    let path = `M0,${baseY} `; // Start at left with baseline
    
    // First quarter - small rise
    path += `L${length * 0.2},${baseY} `;
    path += `L${length * 0.25},${baseY - 3} `;
    path += `L${length * 0.3},${baseY} `;
    
    // Middle section - the main heartbeat spike
    path += `L${length * 0.4},${baseY} `;
    path += `L${length * 0.45},${baseY - 15} `; // Sharp up
    path += `L${length * 0.5},${baseY + 8} `; // Sharp down below baseline
    path += `L${length * 0.55},${baseY - 3} `; // Back up small
    path += `L${length * 0.6},${baseY} `; // Return to baseline
    
    // Last section - small variation then flat
    path += `L${length * 0.7},${baseY} `;
    path += `L${length * 0.75},${baseY - 2} `;
    path += `L${length * 0.8},${baseY} `;
    path += `L${length},${baseY} `; // End at right with baseline
    
    return path;
  };
  
  useEffect(() => {
    // Set the path based on the type prop
    if (type === 'scribble') {
      setPath(generateScribblePath());
    } else {
      setPath(generateHeartbeatPath());
    }
  }, [type, width]);
  
  // Animation variants
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.8, bounce: 0 },
        opacity: { duration: 0.3 }
      }
    }
  };
  
  // Pulse animation for the heartbeat
  const pulseVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  return (
    <div className={`flex justify-center my-2 ${className}`}>
      <motion.svg 
        width={width} 
        height="30" 
        viewBox={`0 0 ${width} 30`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        animate="pulse"
        variants={pulseVariants}
      >
        {/* Glow effect for heartbeat */}
        {type === 'heartbeat' && (
          <motion.path
            d={path}
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.3"
            filter="blur(4px)"
            initial="hidden"
            animate="visible"
            variants={pathVariants}
          />
        )}
        
        <motion.path
          ref={pathRef}
          d={path}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          initial="hidden"
          animate="visible"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
};

export default ScribbleLine;
