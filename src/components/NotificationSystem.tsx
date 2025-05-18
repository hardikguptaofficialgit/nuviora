
import React, { useState, useEffect } from 'react';
import { X, CheckCheck, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);
  
  const getIconByType = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCheck size={18} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-400" />;
      case 'warning':
        return <AlertCircle size={18} className="text-yellow-400" />;
      case 'info':
      default:
        return <Info size={18} className="text-blue-400" />;
    }
  };
  
  const getBgColorByType = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-4 border-green-500 bg-black/90';
      case 'error':
        return 'border-l-4 border-red-500 bg-black/90';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-black/90';
      case 'info':
      default:
        return 'border-l-4 border-blue-500 bg-black/90';
    }
  };
  
  return (
    <div 
      className={`notification-item mb-2 p-4 rounded shadow-lg backdrop-blur-sm animate-enter ${getBgColorByType()}`}
      style={{animationDuration: '300ms'}}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIconByType()}
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-xs opacity-90">{notification.message}</p>
        </div>
        <button 
          onClick={() => onClose(notification.id)} 
          className="ml-2 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const notify = {
    success: (title: string, message: string, duration = 5000) => 
      addNotification({ type: 'success', title, message, duration }),
    error: (title: string, message: string, duration = 5000) => 
      addNotification({ type: 'error', title, message, duration }),
    warning: (title: string, message: string, duration = 5000) => 
      addNotification({ type: 'warning', title, message, duration }),
    info: (title: string, message: string, duration = 5000) => 
      addNotification({ type: 'info', title, message, duration })
  };
  
  return { notifications, notify, removeNotification };
};

const NotificationSystem: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full pointer-events-none">
      <div id="notification-container" className="flex flex-col items-end space-y-2 pointer-events-auto">
        {/* Notifications will be rendered here via context */}
      </div>
    </div>
  );
};

export default NotificationSystem;
