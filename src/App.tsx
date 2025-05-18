
// custom notification system is used instead of toast
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LogoAnimation from "./components/LogoAnimation";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WatchBackground from "./components/WatchBackground";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [appLoaded, setAppLoaded] = useState(false);
  
  useEffect(() => {
    // check if the app has been loaded before in this session
    const hasLoaded = sessionStorage.getItem('appLoaded');
    if (hasLoaded) {
      setShowIntro(false);
      setAppLoaded(true);
    }
  }, []);
  
  const handleIntroComplete = () => {
    setShowIntro(false);
    // mark that the app has been loaded in this session
    sessionStorage.setItem('appLoaded', 'true');
    setAppLoaded(true);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* using custom notification system */}
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              {/* watch background */}
              <WatchBackground />
              
              {/* logo animation intro */}
              {showIntro && <LogoAnimation onAnimationComplete={handleIntroComplete} />}
              
              {/* main app content */}
              <BrowserRouter>
                <SmoothScroll>
                  <AnimatePresence mode="wait">
                    {appLoaded && (
                      <Routes>
                        {/* public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/pricing" element={<Pricing />} />
                        
                        {/* protected routes */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                        
                        {/* catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    )}
                  </AnimatePresence>
                </SmoothScroll>
              </BrowserRouter>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
