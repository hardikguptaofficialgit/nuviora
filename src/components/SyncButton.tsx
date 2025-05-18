
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useNotificationContext } from "@/contexts/NotificationContext";

interface SyncButtonProps {
  onSync: () => void;
}

const SyncButton: React.FC<SyncButtonProps> = ({ onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const { notify } = useNotificationContext();
  
  useEffect(() => {
    const storedLastSynced = localStorage.getItem('lastSynced');
    if (storedLastSynced) {
      setLastSynced(storedLastSynced);
    }
  }, []);
  
  const handleSync = () => {
    setIsSyncing(true);
    setShowRadar(true);
    
    // Hide radar after animation completes
    setTimeout(() => {
      setShowRadar(false);
    }, 2000);
    
    // Complete sync after delay
    setTimeout(() => {
      setIsSyncing(false);
      
      // Store sync time in localStorage
      const now = new Date().toLocaleString();
      localStorage.setItem('lastSynced', now);
      setLastSynced(now);
      
      onSync();
      notify.success("Sync Complete", "Data successfully synchronized from wearable device.");
    }, 2000);
  };
  
  return (
    <div className="relative">
      {showRadar && (
        <div className="absolute inset-0 rounded-full border border-neon animate-radar-scan" />
      )}
      
      <div className="flex flex-col items-end">
        <Button
          variant="outline"
          size="lg"
          disabled={isSyncing}
          onClick={handleSync}
          className={`bg-transparent border border-neon text-neon relative overflow-hidden group hover:bg-neon-dim transition-all duration-300 ${isSyncing ? 'animate-pulse' : ''}`}
        >
          <RefreshCw className={`mr-2 h-4 w-4 transition-all ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
        </Button>
        {lastSynced && (
          <span className="text-xs text-neon-dim mt-1">Last synced: {lastSynced}</span>
        )}
      </div>
    </div>
  );
};

export default SyncButton;
