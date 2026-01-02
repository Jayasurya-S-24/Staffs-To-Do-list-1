import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string, department?: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string, department: string) => boolean;
  updateProfile: (updates: {
    name: string;
    department: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string, department: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      department
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  const updateProfile = (updates: {
    name: string;
    department: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }): boolean => {
    if (!user) return false;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex === -1) return false;

    const currentUser = users[userIndex];

    // If trying to change password, verify current password
    if (updates.newPassword && updates.currentPassword) {
      if (currentUser.password !== updates.currentPassword) {
        return false;
      }
    }

    // Check if email is already taken by another user
    if (updates.email !== currentUser.email) {
      const emailExists = users.some((u: any) => u.email === updates.email && u.id !== user.id);
      if (emailExists) return false;
    }

    // Update user data
    users[userIndex] = {
      ...currentUser,
      name: updates.name,
      department: updates.department,
      email: updates.email,
      password: updates.newPassword || currentUser.password
    };

    localStorage.setItem('users', JSON.stringify(users));

    // Update current user state
    const updatedUser = {
      id: user.id,
      name: updates.name,
      department: updates.department,
      email: updates.email
    };
    
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
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