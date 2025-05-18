import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, Clock, Zap, BarChart, Shield, Brain, Smartphone, ChevronDown, ShoppingCart, LogOut, Menu, X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/CustomCursor';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Create particle animation effect
  useEffect(() => {
    if (isLoading) return;
    
    const createParticles = () => {
      const heroElement = heroRef.current;
      if (!heroElement) return;
      
      const particleContainer = document.createElement('div');
      particleContainer.className = 'absolute inset-0 overflow-hidden pointer-events-none z-10';
      heroElement.appendChild(particleContainer);
      
      // Create particles
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          if (!heroElement.contains(particleContainer)) return;
          
          const particle = document.createElement('div');
          particle.className = 'particle';
          
          // Random position at the bottom of the hero section
          const xPos = Math.random() * heroElement.offsetWidth;
          particle.style.left = `${xPos}px`;
          particle.style.bottom = '0px';
          
          // Random x-offset for floating animation
          const xOffset = (Math.random() - 0.5) * 100;
          particle.style.setProperty('--x-offset', `${xOffset}px`);
          
          particleContainer.appendChild(particle);
          
          // Remove particle after animation completes
          setTimeout(() => {
            if (particleContainer.contains(particle)) {
              particleContainer.removeChild(particle);
            }
          }, 3000);
        }, i * 300);
      }
      
      // Repeat the particle creation
      const intervalId = setInterval(createParticles, 6000);
      
      return () => {
        clearInterval(intervalId);
        if (heroElement.contains(particleContainer)) {
          heroElement.removeChild(particleContainer);
        }
      };
    };
    
    const cleanup = createParticles();
    return cleanup;
  }, [isLoading]);
  
  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col">
      {/* Page Loading Animation */}
      {isLoading && <PageLoadingAnimation onAnimationComplete={() => setIsLoading(false)} />}
      {/* Background Elements */}
      <div className="matrix-bg" />
      <div className="scan-line z-10 pointer-events-none" />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* App Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neon-dim py-2 px-4">
        <div className="container mx-auto flex items-center justify-between relative">
          {/* Left Side - Mobile Menu Button or Empty Space */}
          <div className="w-24 flex items-center">
            <button 
              className="md:hidden text-neon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <img 
              src="/nuviora-logo-dark.png" 
              alt="NuviOra Logo" 
              className="h-10 md:h-12" 
            />
          </div>
          
          {/* Right Side - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 justify-end w-24">
            <Link to="/">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neon-dim hover:bg-neon-dim/20"
              >
                Home
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-dim hover:bg-neon-dim/20"
                  >
                    Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-neon-dim hover:bg-neon-dim/20"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-dim hover:bg-neon-dim/20"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm" 
                    className="bg-neon text-black hover:bg-neon/80"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button is now in the left side div */}
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in bg-black/95 backdrop-blur-md border-t border-neon-dim/30 mt-2">
            <Link 
              to="/" 
              className="block py-2 px-4 hover:bg-neon-dim/20 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 px-4 hover:bg-neon-dim/20 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <div className="pt-3 border-t border-neon-dim/30 px-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-neon-dim hover:bg-neon-dim/20"
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-neon-dim/30 px-4 flex flex-col space-y-3">
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
      </header>
      
      {/* Welcome Hero Section */}
      <div className="hero-section" ref={heroRef}>
        <div className="container mx-auto px-4 py-8 relative z-20">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-center text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span 
              className="text-neon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              NuviOra
            </motion.span>™ Health Monitoring
          </motion.h1>
          <motion.h5 
            className="text-3xl md:text-2xl font-bold white-text text-white tracking-tighter mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Safe. Smart. Uniquely Yours.
          </motion.h5>
          <motion.p 
            className="text-md md:text-xl text-center max-w-3xl mx-auto mb-10 opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Advanced biometric monitoring system that syncs with your Samsung Watch to provide real-time health insights and personalized recommendations.
          </motion.p>
          
          <motion.div 
            className="watch-device"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.0,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.3 } 
            }}
          >
            <div className="watch-strap-left">
              <div className="watch-strap-button"></div>
              <div className="watch-strap-line"></div>
              <div className="watch-strap-button"></div>
            </div>
            <motion.div 
              className="watch-screen"
              animate={{ 
                boxShadow: [
                  "0 0 15px rgba(190, 234, 158, 0.3)",
                  "0 0 25px rgba(190, 234, 158, 0.5)",
                  "0 0 15px rgba(190, 234, 158, 0.3)"
                ]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <div className="watch-content">
                <motion.div 
                  className="text-3xl mb-2"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </motion.div>
                <motion.div 
                  className="text-sm mb-4"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  72 BPM
                </motion.div>
                <div className="text-xs opacity-70">{new Date().toLocaleDateString()}</div>
              </div>
            </motion.div>
            <div className="watch-strap-right">
              <div className="watch-strap-button"></div>
              <div className="watch-strap-line"></div>
              <div className="watch-strap-button"></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center mt-10 flex flex-col md:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  className="neon-border glow-effect w-full md:w-auto animate-pulse-glow"
                >
                  GO TO DASHBOARD
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    className="neon-border glow-effect w-full md:w-auto animate-pulse-glow"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button 
                    variant="ghost" 
                    className="w-full md:w-auto text-neon hover:bg-neon-dim/20"
                  >
                    View Pricing
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-neon mt-24 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            KEY FEATURES
          </motion.h2>
          <div className="feature-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">Health Monitoring</h3>
              <p className="opacity-80">
                Real-time tracking of vital biometrics with our NuviOra Watch X2, providing detailed insights on heart rate, steps, sleep quality, and caloric expenditure.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">Mood Analysis</h3>
              <p className="opacity-80">
                NuviOra's advanced AI algorithms analyze your biometric patterns to detect mood fluctuations and provide personalized recommendations for emotional well-being.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">Healthcare Network</h3>
              <p className="opacity-80">
                Instant access to nearby healthcare specialists based on your health metrics, with personalized recommendations for fatigue management and wellness optimization.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BarChart size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">Data Visualization</h3>
              <p className="opacity-80">
                Interactive charts and analytics with our responsive design provide clear insights into your health metrics trends, accessible on any device with optimized mobile experience.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Smartphone size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">Watch Connection</h3>
              <p className="opacity-80">
                Seamless connection with your smartwatch for continuous health monitoring on the go, with automatic syncing and real-time status updates in our improved interface.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ShoppingCart size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">Recommended Supplements</h3>
              <p className="opacity-80">
                Browse and order personalized health supplements with our improved interface, featuring one-click ordering and detailed product information to support your wellness journey.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">AI Health Assistant</h3>
              <p className="opacity-80">
                Get instant health insights and personalized recommendations with our AI-powered chatbot, trained specifically on health data from your NuviOra Watch X2.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Utensils size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">AI Diet Generator</h3>
              <p className="opacity-80">
                Receive customized meal plans and nutrition advice based on your health metrics, fitness goals, and dietary preferences for optimal wellness and performance.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  className="neon-border glow-effect animate-pulse-glow"
                >
                  ACCESS YOUR DASHBOARD
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button 
                  variant="outline" 
                  className="neon-border glow-effect animate-pulse-glow"
                >
                  GET STARTED
                </Button>
              </Link>
            )}
          </motion.div>
          
          <motion.div 
            className="mt-12 mb-16 opacity-60 text-sm text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>Compatible with Samsung Galaxy Watch Series</p>
            <p className="mt-1">Secure, encrypted connection • Data never leaves your device</p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer with Language Selector */}
      <Footer />
    </div>
  );
};

export default Home;
