
// custom notification system is used instead of toast
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ChatBot from "./components/ChatBot";

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
  const [showIntro, setShowIntro] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  
  useEffect(() => {
    // app loads immediately without intro animation
    setAppLoaded(true);
  }, []);
  

  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* using custom notification system */}
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              {/* watch background */}
              <WatchBackground />
              

              
              {/* main app content */}
              <BrowserRouter>
                <SmoothScroll>
                  <AnimatePresence mode="wait">
                    {appLoaded && (
                      <>
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
                        
                        {/* Global ChatBot component */}
                        <ChatBot />
                      </>
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
