
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { notify } = useNotificationContext();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        notify.success("Login successful", "Welcome back to NuviOra");
      } else {
        notify.error("Login failed", "Invalid email or password. Hint: try demo@example.com / password123");
      }
    } catch (error) {
      notify.error("Error", "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold neon-text tracking-tighter">NuviOra LOGIN</h2>
        <p className="text-sm opacity-70 mt-2">Access your biometric dashboard</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@example.com"
            required
            className="bg-transparent border-neon-dim focus:border-neon"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
            required
            className="bg-transparent border-neon-dim focus:border-neon"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-transparent border border-neon text-neon hover:bg-neon-dim"
        >
          {isLoading ? (
            "Authenticating..."
          ) : (
            <>
              <LogIn size={18} className="mr-2" /> Sign In
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;
