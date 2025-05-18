
import React, { useState, useEffect } from 'react';
import { Watch, Loader2, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotificationContext } from '../contexts/NotificationContext';

interface WatchDevice {
  id: string;
  name: string;
  model: string;
  battery: number;
  connected: boolean;
  lastSync: string | null;
}

const mockWatches: WatchDevice[] = [
  { 
    id: 'gw4-1234', 
    name: 'Galaxy Watch 4', 
    model: 'Samsung SM-R860', 
    battery: 72, 
    connected: false, 
    lastSync: null 
  },
  { 
    id: 'gw5-5678', 
    name: 'Galaxy Watch 5 Pro', 
    model: 'Samsung SM-R920', 
    battery: 81, 
    connected: false, 
    lastSync: null 
  },
  { 
    id: 'gw6-9012', 
    name: 'Galaxy Watch 6', 
    model: 'Samsung SM-R940', 
    battery: 95, 
    connected: false, 
    lastSync: null 
  }
];

interface WatchConnectionProps {
  onSync?: () => void;
}

const WatchConnection: React.FC<WatchConnectionProps> = ({ onSync }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<WatchDevice[]>([]);
  const [connectingDevice, setConnectingDevice] = useState<string | null>(null);
  const { notify } = useNotificationContext();

  const handleScanForDevices = () => {
    setIsScanning(true);
    setFoundDevices([]);

    // Simulate scanning with timeouts to discover devices one by one
    setTimeout(() => {
      setFoundDevices([mockWatches[0]]);
      
      setTimeout(() => {
        setFoundDevices([mockWatches[0], mockWatches[1]]);
        
        setTimeout(() => {
          setFoundDevices([...mockWatches]);
          setIsScanning(false);
        }, 1500);
      }, 1200);
    }, 800);
  };

  const handleConnectDevice = (deviceId: string) => {
    setConnectingDevice(deviceId);
    
    // Simulate connection process
    setTimeout(() => {
      setFoundDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId 
            ? { 
                ...device, 
                connected: true, 
                lastSync: new Date().toLocaleString() 
              } 
            : device
        )
      );
      
      setConnectingDevice(null);
      
      notify.success(
        "Watch Connected", 
        `Successfully connected to ${foundDevices.find(d => d.id === deviceId)?.name}. Your health data will sync automatically.`,
        5000
      );
      
      // Store connected device info in localStorage
      const connectedDevice = foundDevices.find(d => d.id === deviceId);
      if (connectedDevice) {
        localStorage.setItem('connectedWatch', JSON.stringify({
          ...connectedDevice,
          connected: true,
          lastSync: new Date().toLocaleString()
        }));
        
        // Call onSync if provided
        if (onSync) {
          onSync();
        }
      }
    }, 2000);
  };

  const handleDisconnectDevice = (deviceId: string) => {
    setConnectingDevice(deviceId);
    
    // Simulate disconnection process
    setTimeout(() => {
      setFoundDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId 
            ? { 
                ...device, 
                connected: false, 
                lastSync: null 
              } 
            : device
        )
      );
      
      setConnectingDevice(null);
      
      notify.info(
        "Watch Disconnected", 
        `Disconnected from ${foundDevices.find(d => d.id === deviceId)?.name}.`,
        5000
      );
      
      // Remove connected device info from localStorage
      localStorage.removeItem('connectedWatch');
    }, 1000);
  };

  // Load any previously connected device from localStorage
  useEffect(() => {
    const savedDevice = localStorage.getItem('connectedWatch');
    if (savedDevice) {
      try {
        const parsedDevice = JSON.parse(savedDevice) as WatchDevice;
        setFoundDevices(mockWatches.map(device => 
          device.id === parsedDevice.id ? parsedDevice : device
        ));
      } catch (error) {
        console.error('Error parsing saved watch data:', error);
      }
    }
  }, []);

  return (
    <Card className="biometric-card">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Watch className="mr-2 h-5 w-5" /> Watch Connection
          </h3>
          <p className="text-sm text-neon">
           
           <br></br> Connect your  watch to track your health metrics in real-time
          </p>
        </div>
        
        {foundDevices.some(device => device.connected) ? (
          <div className="space-y-4">
            <div className="connected-device-animation flex items-center justify-center mb-4">
              <div className="watch-animation">
                <span className="pulse-ring"></span>
                <Watch className="h-10 w-10 text-neon" />
              </div>
            </div>
            
            {foundDevices.filter(device => device.connected).map(device => (
              <div key={device.id} className="border border-neon-dim rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">{device.name}</h4>
                    <p className="text-xs text-neon-dim">{device.model}</p>
                    <div className="text-xs mt-1 flex items-center">
                      <span className="text-neon">
                        <Check size={12} className="inline mr-1" />
                        Connected
                      </span>
                      <span className="mx-2">•</span>
                      <span>{device.battery}% battery</span>
                    </div>
                    <p className="text-xs mt-1">Last sync: {device.lastSync}</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-neon hover:bg-red-950 hover:text-white"
                    onClick={() => handleDisconnectDevice(device.id)}
                    disabled={connectingDevice === device.id}
                  >
                    {connectingDevice === device.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <X className="h-3 w-3 mr-1" />
                    )}
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full border-neon text-neon hover:bg-neon hover:text-black"
              onClick={handleScanForDevices}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning for devices...
                </>
              ) : (
                <>
                  <Watch className="mr-2 h-4 w-4" />
                  Scan for Watches
                </>
              )}
            </Button>
            
            {isScanning && (
              <div className="text-center py-4">
                <div className="scanning-animation mb-2"></div>
                <p className="text-sm text-neon-dim">Scanning for nearby devices...</p>
              </div>
            )}
            
            {foundDevices.length > 0 && (
              <div className="space-y-2 mt-3">
                <h4 className="text-xs uppercase tracking-wider text-neon-dim">Available Devices</h4>
                {foundDevices.map(device => (
                  <div key={device.id} className="border border-neon-dim rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">{device.name}</h4>
                        <p className="text-xs text-neon-dim">{device.model}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-neon hover:bg-neon-dim"
                        onClick={() => handleConnectDevice(device.id)}
                        disabled={connectingDevice === device.id}
                      >
                        {connectingDevice === device.id ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <>Connect</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <style dangerouslySetInnerHTML={{ 
        __html: `
          .connected-device-animation {
            position: relative;
            height: 80px;
          }
          
          .watch-animation {
            position: relative;
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
          
          .scanning-animation {
            width: 100%;
            height: 4px;
            background: linear-gradient(to right, transparent, #BEEA9E, transparent);
            background-size: 200% 100%;
            animation: scanning 2s infinite linear;
          }
          
          @keyframes scanning {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `
      }} />
    </Card>
  );
};

export default WatchConnection;
