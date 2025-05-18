
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { notify } = useNotificationContext();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      notify.error("Password mismatch", "Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(name, email, password);
      
      if (success) {
        notify.success("Registration successful", "Welcome to NuviOra");
      } else {
        notify.error("Registration failed", "Email may already be in use");
      }
    } catch (error) {
      notify.error("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold neon-text tracking-tighter">NuviOra REGISTER</h2>
        <p className="text-sm opacity-70 mt-2">Create a new biometric profile</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm">Full Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="bg-transparent border-neon-dim focus:border-neon"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="register-email" className="text-sm">Email</label>
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="bg-transparent border-neon-dim focus:border-neon"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="register-password" className="text-sm">Password</label>
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-transparent border-neon-dim focus:border-neon"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm">Confirm Password</label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
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
            "Creating Account..."
          ) : (
            <>
              <UserPlus size={18} className="mr-2" /> Create Account
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Register;
