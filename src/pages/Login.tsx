import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Eye, EyeOff, LogIn, ArrowRight, ChevronLeft } from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';

const Login = () => {
  const [email, setEmail] = useState('hardikgupta8792@gmail.com');
  const [password, setPassword] = useState('hardik8@1');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useNotificationContext();
  
  // Check if we're coming from the device connection popup
  const redirectToDashboard = location.state?.redirectToDashboard;
  
  // redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Show notification if coming from device connection
  useEffect(() => {
    if (redirectToDashboard) {
      notify.info(
        "Device Connected", 
        "Please log in to manage your connected device on the dashboard.",
        5000
      );
    }
  }, [redirectToDashboard, notify]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      notify.error("Error", "Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        notify.success("Success", "You have been logged in successfully");
        navigate('/dashboard');
        
        // If device was connected, show additional notification
        if (redirectToDashboard) {
          setTimeout(() => {
            notify.success(
              "Ready to Manage", 
              "Your connected device is now ready to be managed on the dashboard.",
              5000
            );
          }, 1000);
        }
      } else {
        notify.error("Error", "Invalid email or password");
      }
    } catch (error) {
      notify.error("Error", "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Custom Cursor */}
      <CustomCursor />
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted shadow-inner">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-neon/20 to-neon/10 rounded-full blur-xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-neon/20 to-neon-dim rounded-full blur-xl animate-pulse-glow"></div>
        <div className="absolute inset-0 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-b after:from-transparent after:via-neon/5 after:to-transparent after:animate-scan-line"></div>
        
        {/* Brand Showcase */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <img 
            src="/nuviora-logo-dark.png" 
            alt="NuviOra Logo" 
            className="w-35 h-35 object-contain mb-8" 
          />
          <p className="text-foreground text-xl max-w-md text-center font-light">Your personal health companion for monitoring and optimizing wellness</p>
          
          <div className="mt-12 space-y-6 max-w-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-neon-dim flex items-center justify-center border border-neon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-foreground font-medium">Secure Health Monitoring</h3>
                <p className="text-foreground/70 text-sm">Your data is encrypted and protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-neon-dim flex items-center justify-center border border-neon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-foreground font-medium">AI-Powered Insights</h3>
                <p className="text-foreground/70 text-sm">Advanced analysis of your health data</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-neon-dim flex items-center justify-center border border-neon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-foreground font-medium">Real-time Monitoring</h3>
                <p className="text-foreground/70 text-sm">Track your health metrics in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-foreground/70 hover:text-neon transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Link>
          </div>
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img 
              src="/nuviora-logo-dark.png" 
              alt="NuviOra Logo" 
              className="w-35 h-35 object-contain mb-4" 
            />
          </div>
          
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-neon-dim backdrop-blur-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-foreground/70">Please enter your details to sign in</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Use hardikgupta8792@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" border-gray-200 rounded-lg py-3 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <a href="#" className="text-sm text-neon hover:text-neon/80 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Use hardik8@1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200 rounded-lg py-3 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-neon transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-black to-black/80 border border-neon hover:border-neon/80 text-neon hover:text-neon/80 font-medium py-3 rounded-lg transition-all flex items-center justify-center group relative overflow-hidden"
                style={{
                  boxShadow: '0 0 10px rgba(190, 234, 158, 0.3)'
                }} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign in
                    <LogIn size={18} className="ml-2" />
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-foreground/70">Don't have an account?{" "}
                <Link to="/signup" className="text-neon hover:text-neon/80 font-medium">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
