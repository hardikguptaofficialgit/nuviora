
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  animationDelay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon,
  animationDelay
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);
  
  return (
    <Card 
      className={`p-6 opacity-0 transform translate-y-4 ${isVisible ? 'animate-fade-in-up' : ''} relative bg-black/30 backdrop-blur-sm border border-neon rounded-md overflow-hidden transition-all duration-300`}
      style={{
        animationDelay: `${animationDelay}ms`,
        borderColor: isHovered ? 'var(--neon)' : 'var(--neon-dim)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-xs uppercase tracking-wider text-white mb-1">{title}</h3>
          <div className={`flex items-center space-x-1 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className="text-sm opacity-70 text-white">{unit}</span>
          </div>
        </div>
        <div className={`transition-all duration-300 ${isHovered ? 'scale-125' : ''} text-white`}>
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-dim/30 overflow-hidden">
        <div 
          className={`h-full bg-neon transition-all duration-1000`}
          style={{ 
            width: `${typeof value === 'number' ? Math.min(100, value / 2) : 50}%`,
            opacity: isHovered ? 0.9 : 0.5
          }}
        />
      </div>
    </Card>
  );
};

export default MetricCard;
