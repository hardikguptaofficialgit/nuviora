
import React, { useState, useEffect } from 'react';
import { Battery, Signal, Wifi, CloudOff, Watch } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useAuth } from '@/contexts/AuthContext';

interface WatchStatusProps {
  connected?: boolean;
  lastUpdated?: string;
  autoSync?: boolean;
  onToggleAutoSync?: () => void;
}

const WatchStatus: React.FC<WatchStatusProps> = ({
  connected: propConnected,
  lastUpdated: propLastUpdated,
  autoSync: propAutoSync,
  onToggleAutoSync
}) => {
  const { user } = useAuth();
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signal, setSignal] = useState(4); // Out of 5
  const [connected, setConnected] = useState(propConnected ?? true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoSync, setAutoSync] = useState(propAutoSync ?? true);
  const [steps, setSteps] = useState(0);
  const [watchInfo, setWatchInfo] = useState({
    model: 'NuviOra Watch X2',
    serial: `BS-2025-${Math.floor(Math.random() * 10000)}`,
    firmware: 'v0.1'
  });

  // Check if a Samsung watch is connected via localStorage
  useEffect(() => {
    const checkWatchConnection = () => {
      const savedDevice = localStorage.getItem('connectedWatch');
      if (savedDevice) {
        try {
          const parsedDevice = JSON.parse(savedDevice);
          if (parsedDevice.connected) {
            setWatchInfo({
              model: parsedDevice.name,
              serial: parsedDevice.model,
              firmware: 'Latest'
            });
            setBatteryLevel(parsedDevice.battery);
            setConnected(true);
          }
        } catch (error) {
          console.error('Error parsing saved watch data:', error);
        }
      }
    };

    checkWatchConnection();
    // Check periodically for changes
    const interval = setInterval(checkWatchConnection, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Update time and simulate steps increasing
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    const stepsInterval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    
    // Simulate signal fluctuation
    const signalInterval = setInterval(() => {
      setSignal(Math.max(2, Math.floor(Math.random() * 6))); // Min 2, max 5
      setBatteryLevel(prev => {
        const newLevel = prev - Math.random();
        return newLevel < 10 ? 85 : newLevel;
      });
      
      // Occasional disconnect only if not controlled by props
      if (propConnected === undefined && Math.random() > 0.95) {
        setConnected(false);
        setTimeout(() => setConnected(true), 3000);
      }
    }, 15000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(stepsInterval);
      clearInterval(signalInterval);
    };
  }, []);
  
  return (
    <div className="mb-6">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="biometric-card cursor-pointer">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
              <div className="flex items-center w-full sm:w-auto">
                <div className="watch-device-small mr-4">
                  <div className="watch-strap-left-small">
                    <div className="watch-strap-button-small"></div>
                    <div className="watch-strap-line-small"></div>
                  </div>
                  <div className="watch-screen-small">
                    <div className="watch-content-small">
                      <Watch size={16} className="text-neon" />
                    </div>
                  </div>
                  <div className="watch-strap-right-small">
                    <div className="watch-strap-button-small"></div>
                    <div className="watch-strap-line-small"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium neon-text">{watchInfo.model}</h3>
                  <p className="text-xs opacity-70">STATUS: {connected ? 'CONNECTED' : 'RECONNECTING...'}</p>
                
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="mr-0 sm:mr-4 order-first w-full sm:w-auto mb-1 sm:mb-0">
                  <p className="text-sm font-medium neon-text text-center sm:text-left">Hey, {user?.name || 'User'}</p>
                </div>
                {connected ? (
                  <>
                    <div className="signal-indicator">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-sm ${i < signal ? 'bg-neon h-3' : 'bg-neon-dim h-1'} mx-px`}
                        />
                      ))}
                    </div>
                    <Wifi size={14} className="text-neon" />
                  </>
                ) : (
                  <CloudOff size={14} className="text-neon-dim animate-pulse" />
                )}
                <div className="flex items-center space-x-1">
                  <Battery size={16} className={batteryLevel < 20 ? "text-red-400" : "text-neon"} />
                  <span className="text-xs">{Math.floor(batteryLevel)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-black/80 backdrop-blur-sm border-neon">
          <div className="space-y-2">
            <h4 className="font-medium neon-text">Device Information</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="opacity-70">Model:</span>
              <span>{watchInfo.model}</span>
              <span className="opacity-70">Serial:</span>
              <span>{watchInfo.serial}</span>
              <span className="opacity-70">Firmware:</span>
              <span>{watchInfo.firmware}</span>
              <span className="opacity-70">Today's Steps:</span>
              <span>{steps.toLocaleString()}</span>
              <span className="opacity-70">Battery Status:</span>
              <div className="flex items-center space-x-2">
                <div className="battery-level">
                  <div 
                    className="battery-level-fill" 
                    style={{width: `${batteryLevel}%`}}
                  />
                </div>
                <span>{Math.floor(batteryLevel)}%</span>
              </div>
              <span className="opacity-70">Last Synced:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <style>
        {`
        .watch-device-small {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }
        .watch-screen-small {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
        }
        .watch-content-small {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .signal-indicator {
          display: flex;
          align-items: flex-end;
          height: 12px;
          margin: 0 4px;
        }
        .battery-level {
          width: 30px;
          height: 10px;
          border: 1px solid #BEEA9E;
          border-radius: 2px;
          overflow: hidden;
        }
        .battery-level-fill {
          background-color: #BEEA9E;
          height: 100%;
        }
        `}
      </style>
    </div>
  );
};

export default WatchStatus;
