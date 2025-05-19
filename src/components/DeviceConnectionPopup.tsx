import React, { useState } from 'react';
import { Watch, Loader2, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface DeviceConnectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceConnectionPopup: React.FC<DeviceConnectionPopupProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { notify } = useNotificationContext();
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleScanForDevices = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setIsConnecting(true);
      
      // Simulate connection process
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        
        // Store connected device info in localStorage
        localStorage.setItem('connectedWatch', JSON.stringify({
          id: 'gw4-1234',
          name: 'Galaxy Watch 4',
          model: 'Samsung SM-R860',
          battery: 72,
          connected: true,
          lastSync: new Date().toLocaleString()
        }));
        
        notify.success(
          "Watch Connected", 
          "Successfully connected to Galaxy Watch 4. Manage your health data on the dashboard.",
          5000
        );
      }, 2000);
    }, 3000);
  };

  const handleManageDashboard = () => {
    onClose();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { redirectToDashboard: true } });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-black/90 border border-neon-dim rounded-lg p-6 max-w-md w-full mx-4 relative"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-white hover:text-neon"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-neon/10 rounded-full mb-4">
                <Watch className="h-8 w-8 text-neon" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Connect Your Watch</h2>
              <p className="text-neon text-sm">
                Connect your Samsung watch to track your health metrics in real-time
              </p>
            </div>
            
            {!isConnected ? (
              <div className="space-y-4">
                {isScanning ? (
                  <div className="text-center py-4">
                    <div className="scanning-animation mb-4 mx-auto"></div>
                    <p className="text-sm text-neon animate-pulse">Scanning for nearby devices...</p>
                  </div>
                ) : isConnecting ? (
                  <div className="text-center py-4">
                    <div className="connecting-animation mb-4 mx-auto">
                      <Watch className="h-10 w-10 text-neon" />
                      <span className="pulse-ring"></span>
                    </div>
                    <p className="text-sm text-neon animate-pulse">Connecting to Galaxy Watch 4...</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-neon text-neon hover:bg-neon hover:text-black"
                    onClick={handleScanForDevices}
                  >
                    <Watch className="mr-2 h-4 w-4" />
                    Connect Watch
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="connected-animation mb-4 mx-auto">
                    <Watch className="h-10 w-10 text-neon" />
                    <span className="pulse-ring"></span>
                  </div>
                  <p className="text-sm text-neon mb-2">Galaxy Watch 4 Connected!</p>
                  <p className="text-xs text-neon-dim">Your health data will sync automatically</p>
                </div>
                
                <Button
                  className="w-full bg-neon text-black hover:bg-neon/80"
                  onClick={handleManageDashboard}
                >
                  Manage on Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
          
          <style dangerouslySetInnerHTML={{ 
            __html: `
              .scanning-animation {
                width: 60px;
                height: 4px;
                background: linear-gradient(to right, transparent, #BEEA9E, transparent);
                background-size: 200% 100%;
                animation: scanning 2s infinite linear;
              }
              
              @keyframes scanning {
                0% { background-position: 100% 0; }
                100% { background-position: -100% 0; }
              }
              
              .connecting-animation,
              .connected-animation {
                position: relative;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              .pulse-ring {
                position: absolute;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 2px solid #BEEA9E;
                animation: pulse 2s infinite;
              }
              
              @keyframes pulse {
                0% {
                  transform: scale(0.8);
                  opacity: 1;
                }
                70% {
                  transform: scale(1.3);
                  opacity: 0;
                }
                100% {
                  transform: scale(0.8);
                  opacity: 0;
                }
              }
            `
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeviceConnectionPopup;
