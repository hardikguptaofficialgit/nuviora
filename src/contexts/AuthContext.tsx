
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Hardik Gupta',
    email: 'hardikgupta8792@gmail.com',
    password: 'hardik8@1'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  
  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true
        });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(
      user => user.email === email && user.password === password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true
      });
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };
  
  // Mock register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (MOCK_USERS.some(user => user.email === email)) {
      return false;
    }
    
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      password
    };
    
    MOCK_USERS.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true
    });
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
  };
  
  // Logout function
  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
