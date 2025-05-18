import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neon-dim">
      <div className="container mx-auto px-6 py-5 md:py-6 max-w-7xl w-full">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl md:text-3xl font-bold neon-text">NuviOra™</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-base font-medium hover:text-neon transition-colors">Home</Link>
            {isHomePage && (
              <Link to="/pricing" className="text-base font-medium hover:text-neon transition-colors">Pricing</Link>
            )}
            {isAuthenticated && (
              <Link to="/dashboard" className="text-base font-medium hover:text-neon transition-colors">Dashboard</Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-dim hover:bg-neon-dim/20"
                  >
                    <User size={16} className="mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/90 border-neon-dim">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-neon-dim/20"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="border-neon-dim hover:bg-neon-dim/20 px-5"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="default" 
                    className="bg-neon text-black hover:bg-neon/80 px-5"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-neon p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-6 animate-fade-in bg-black/90 border-t border-neon-dim/30 mt-3 rounded-b-lg">
            <Link 
              to="/" 
              className="block py-4 px-6 hover:text-neon transition-colors text-xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isHomePage && (
              <Link 
                to="/pricing" 
                className="block py-4 px-6 hover:text-neon transition-colors text-xl font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            )}
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="block py-4 px-6 hover:text-neon transition-colors text-xl font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="pt-5 border-t border-neon-dim/30 px-6">
                <div className="flex items-center mb-3">
                  <User size={16} className="mr-2 text-neon" />
                  <span>{user?.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-neon-dim hover:bg-neon-dim/20"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-5 border-t border-neon-dim/30 flex flex-col space-y-4 px-6">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-neon-dim hover:bg-neon-dim/20"
                  >
                    Login
                  </Button>
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button 
                    size="sm" 
                    className="w-full bg-neon text-black hover:bg-neon/80"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
