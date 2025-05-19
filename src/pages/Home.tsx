import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, Clock, Zap, BarChart, Shield, Brain, Smartphone, ChevronDown, ShoppingCart, LogOut, Menu, X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/CustomCursor';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import DeviceConnectionPopup from '@/components/DeviceConnectionPopup';

const Home = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDevicePopup, setShowDevicePopup] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Show device connection popup after page loads
  useEffect(() => {
    // Check if a device is already connected
    const connectedWatch = localStorage.getItem('connectedWatch');
    
    // Only show popup if no device is connected
    if (!connectedWatch) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShowDevicePopup(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Removed particle animation effect for better performance
  
  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col">
      {/* page loading animation */}
      {isLoading && <PageLoadingAnimation onAnimationComplete={() => setIsLoading(false)} />}
      {/* background elements */}
      <div className="matrix-bg" />
      <div className="scan-line z-10 pointer-events-none" />
      
      {/* Device connection popup */}
      <DeviceConnectionPopup 
        isOpen={showDevicePopup} 
        onClose={() => setShowDevicePopup(false)} 
      />
      
      {/* custom cursor */}
      <CustomCursor />
      
      {/* app header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neon-dim py-2 px-4">
        <div className="container mx-auto flex items-center justify-between relative">
          {/* left side - mobile menu button or empty space */}
          <div className="w-24 flex items-center">
            <button 
              className="md:hidden text-neon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* centered logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <img 
              src="/nuviora-logo-dark.png" 
              alt="NuviOra Logo" 
              className="h-10 md:h-12" 
            />
          </div>
          
          {/* right side - desktop navigation */}
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
          
          {/* mobile menu button is now in the left side div */}
        </div>
        
        {/* mobile navigation menu */}
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
      
      {/* welcome hero section */}
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
                <Brain size={32} />
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
                <Zap size={32} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-white">NuviOra Chatbot</h3>
              <p className="opacity-80">
                Chat with our intelligent NuviOra assistant developed by NuviOra Healthcare Tech. Get answers to health questions, wellness tips, and personalized guidance anytime, anywhere.
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
                  className="neon-border animate-pulse"
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
      
      {/* circuit design before footer */}
      <div className="relative w-full py-8">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
            {/* main circuit paths */}
            <path d="M0,50 H100 M100,50 V100 M100,100 H200 M200,100 V150 M200,150 H300 M300,150 V100 M300,100 H400 M400,100 V50 M400,50 H500 M500,50 V100 M500,100 H600 M600,100 V150 M600,150 H700 M700,150 V100 M700,100 H800 M800,100 V50 M800,50 H900 M900,50 V100 M900,100 H1000" 
                  stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="square" />
            <path d="M0,150 H50 M50,150 V100 M50,100 H150 M150,100 V50 M150,50 H250 M250,50 V100 M250,100 H350 M350,100 V150 M350,150 H450 M450,150 V100 M450,100 H550 M550,100 V50 M550,50 H650 M650,50 V100 M650,100 H750 M750,100 V150 M750,150 H850 M850,150 V100 M850,100 H950 M950,100 V50 M950,50 H1000" 
                  stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="square" />
                  
            {/* secondary circuit paths */}
            <path d="M25,25 H125 M125,25 V75 M125,75 H225 M225,75 V125 M225,125 H325 M325,125 V75 M325,75 H425 M425,75 V25 M425,25 H525 M525,25 V75 M525,75 H625 M625,75 V125 M625,125 H725 M725,125 V75 M725,75 H825 M825,75 V25 M825,25 H925 M925,25 V75 M925,75 H1000" 
                  stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="square" />
            <path d="M0,175 H75 M75,175 V125 M75,125 H175 M175,125 V75 M175,75 H275 M275,75 V125 M275,125 H375 M375,125 V175 M375,175 H475 M475,175 V125 M475,125 H575 M575,125 V75 M575,75 H675 M675,75 V125 M675,125 H775 M775,125 V175 M775,175 H875 M875,175 V125 M875,125 H975 M975,125 V75 M975,75 H1000" 
                  stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="square" />
            
            {/* connection nodes - large */}
            <circle cx="100" cy="50" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="100" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="200" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="200" cy="150" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="300" cy="150" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="300" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="400" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="400" cy="50" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="500" cy="50" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="500" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="600" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="600" cy="150" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="700" cy="150" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="700" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="800" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="800" cy="50" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="900" cy="50" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="900" cy="100" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            
            {/* connection nodes - small */}
            <circle cx="50" cy="150" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="50" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="150" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="150" cy="50" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="250" cy="50" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="250" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="350" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="350" cy="150" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="450" cy="150" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="450" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="550" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="550" cy="50" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="650" cy="50" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="650" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="750" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="750" cy="150" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="850" cy="150" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="850" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="950" cy="100" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="950" cy="50" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            
            {/* circuit components */}
            <rect x="125" y="20" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="225" y="120" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="325" y="70" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="425" y="20" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="525" y="70" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="625" y="120" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="725" y="70" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="825" y="20" width="50" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            
            {/* ic chips */}
            <rect x="175" y="75" width="30" height="30" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="475" y="125" width="30" height="30" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            <rect x="775" y="75" width="30" height="30" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="0" />
            
            {/* ic chip pins */}
            <line x1="180" y1="75" x2="180" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="185" y1="75" x2="185" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="190" y1="75" x2="190" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="195" y1="75" x2="195" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="200" y1="75" x2="200" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            
            <line x1="480" y1="125" x2="480" y2="120" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="485" y1="125" x2="485" y2="120" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="490" y1="125" x2="490" y2="120" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="495" y1="125" x2="495" y2="120" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="500" y1="125" x2="500" y2="120" stroke="#FFFFFF" strokeWidth="1" />
            
            <line x1="780" y1="75" x2="780" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="785" y1="75" x2="785" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="790" y1="75" x2="790" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="795" y1="75" x2="795" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="800" y1="75" x2="800" y2="70" stroke="#FFFFFF" strokeWidth="1" />
            
            {/* small details */}
            <circle cx="125" cy="25" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="225" cy="125" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="325" cy="75" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="425" cy="25" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="525" cy="75" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="625" cy="125" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="725" cy="75" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="825" cy="25" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="w-full border-b border-neon-dim/30 py-4"></div>
        </div>
      </div>
      
      {/* footer with language selector */}
      <Footer />
    </div>
  );
};

export default Home;
