import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user by email in mock data
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    // For demo purposes, allow any email with specific roles
    const roleEmails: Record<string, UserRole> = {
      'admin@hospital.com': 'admin',
      'doctor@hospital.com': 'doctor',
      'nurse@hospital.com': 'nurse',
      'receptionist@hospital.com': 'receptionist',
      'patient@hospital.com': 'patient',
    };
    
    const role = roleEmails[email.toLowerCase()];
    if (role) {
      setUser({
        id: 'demo-' + role,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: email,
        role: role,
        department: role === 'admin' ? 'Administration' : undefined,
        createdAt: new Date(),
      });
      return true;
    }
    
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
