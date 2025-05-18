import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-black/80 backdrop-blur-md border-t border-neon-dim/30 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img 
              src="/nuviora-logo-dark.png" 
              alt="NuviOra Logo" 
              className="h-8" 
            />
            <p className="text-xs mt-2 opacity-70">
              Safe. Smart. Uniquely Yours.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex gap-4">
              <Link to="#" className="text-sm hover:text-neon transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-sm hover:text-neon transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-sm hover:text-neon transition-colors">
                Contact
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-neon transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-neon transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
            
            <LanguageSelector />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-neon-dim/10 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
          <p>© {currentYear} NuviOra Health Technologies. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart size={12} className="mx-1 text-red-500" /> for your health
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
