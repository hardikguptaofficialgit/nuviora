
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold neon-text tracking-tighter">NuviOra</h1>
            <p className="text-sm mt-2">Biometric Analysis System</p>
          </div>
          
          <div className="flex justify-center mb-6 space-x-2">
            <Button
              variant={authMode === 'login' ? 'default' : 'outline'}
              onClick={() => setAuthMode('login')}
              className={authMode === 'login' ? 'bg-neon text-black' : 'bg-transparent border-neon text-neon'}
            >
              Login
            </Button>
            <Button
              variant={authMode === 'register' ? 'default' : 'outline'}
              onClick={() => setAuthMode('register')}
              className={authMode === 'register' ? 'bg-neon text-black' : 'bg-transparent border-neon text-neon'}
            >
              Register
            </Button>
          </div>
          
          {authMode === 'login' ? <Login /> : <Register />}
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center">
        <div className="mr-4 flex items-center">
          <div className="h-8 w-8 rounded-full bg-neon flex items-center justify-center text-black font-bold text-sm">
            {user?.name.charAt(0)}
          </div>
          <span className="ml-2 text-sm hidden md:inline">{user?.name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="bg-transparent text-neon hover:bg-neon-dim hover:text-neon"
        >
          <LogOut size={16} />
          <span className="ml-1 hidden md:inline">Logout</span>
        </Button>
      </div>
      {children}
    </>
  );
};

export default AuthWrapper;
