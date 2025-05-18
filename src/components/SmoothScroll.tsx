import React, { useEffect, ReactNode, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initSmoothAnchorLinks } from '@/utils/scrollUtils';
import ScrollToTop from './ScrollToTop';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const scrollRequest = useRef(0);
  const ease = 0.075; // Lower = slower, higher = faster

  // Handle smooth scrolling
  const smoothScroll = () => {
    // Calculate the distance between current position and target
    const distance = targetScrollY.current - currentScrollY.current;
    const acceleration = distance * ease;
    
    // Update current position if the distance is significant
    if (Math.abs(distance) > 0.1) {
      currentScrollY.current += acceleration;
      window.scrollTo(0, currentScrollY.current);
      scrollRequest.current = requestAnimationFrame(smoothScroll);
    } else {
      // Snap to exact position when close enough
      window.scrollTo(0, targetScrollY.current);
      cancelAnimationFrame(scrollRequest.current);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    // Initialize current scroll position
    currentScrollY.current = window.scrollY;
    targetScrollY.current = window.scrollY;
    
    // Handle scroll events
    const handleScroll = () => {
      // Update target position
      targetScrollY.current = window.scrollY;
      
      // Start animation if not already running
      if (!scrollRequest.current) {
        scrollRequest.current = requestAnimationFrame(smoothScroll);
      }
    };
    
    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(scrollRequest.current);
    };
  }, []);

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    targetScrollY.current = 0;
    currentScrollY.current = 0;
  }, [location.pathname]);
  
  // Initialize smooth scrolling for anchor links
  useEffect(() => {
    // Initialize smooth scrolling for anchor links with 80px offset for header
    initSmoothAnchorLinks(80);
  }, []);

  return (
    <div ref={scrollRef} className="smooth-scroll-container">
      {children}
      <ScrollToTop />
    </div>
  );
};

export default SmoothScroll;
