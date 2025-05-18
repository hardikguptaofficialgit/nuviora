
import React, { createContext, useContext, ReactNode } from 'react';
import NotificationSystem, { useNotification, Notification } from '../components/NotificationSystem';

interface NotificationContextType {
  notifications: Notification[];
  notify: {
    success: (title: string, message: string, duration?: number) => string;
    error: (title: string, message: string, duration?: number) => string;
    warning: (title: string, message: string, duration?: number) => string;
    info: (title: string, message: string, duration?: number) => string;
  };
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { notifications, notify, removeNotification } = useNotification();
  
  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full pointer-events-none">
        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
          {notifications.map(notification => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationItem 
                notification={notification} 
                onClose={removeNotification} 
              />
            </div>
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem: React.FC<{ 
  notification: Notification; 
  onClose: (id: string) => void 
}> = ({ notification, onClose }) => {
  React.useEffect(() => {
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
        return <div className="text-green-400">✓</div>;
      case 'error':
        return <div className="text-red-400">✗</div>;
      case 'warning':
        return <div className="text-yellow-400">⚠</div>;
      case 'info':
      default:
        return <div className="text-blue-400">ℹ</div>;
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
          ×
        </button>
      </div>
    </div>
  );
};
