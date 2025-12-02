import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'buyer' | 'expert';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('agroconnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    // Mock registration - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('agroconnect_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      password // In production, never store plain passwords!
    };

    users.push(newUser);
    localStorage.setItem('agroconnect_users', JSON.stringify(users));

    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    setUser(userWithoutPassword);
    localStorage.setItem('agroconnect_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock login - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('agroconnect_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password && u.role === role);

    if (foundUser) {
      const userWithoutPassword = { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role };
      setUser(userWithoutPassword);
      localStorage.setItem('agroconnect_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agroconnect_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
