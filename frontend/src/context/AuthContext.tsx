import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { api, getStoredToken, setStoredToken } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerStudent: (data: any) => Promise<User>;
  registerCompany: (data: any) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isStudent: boolean;
  isCompany: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!getStoredToken()) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await api.getMe();
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role as UserRole,
        accountStatus: data.accountStatus,
        createdAt: data.createdAt,
      });
    } catch (err) {
      console.warn('Failed to fetch current user profile, clearing token:', err);
      setStoredToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const resp = await api.login({ email, password });
    setStoredToken(resp.accessToken);
    setToken(resp.accessToken);

    const loggedInUser: User = {
      id: resp.userId,
      fullName: resp.fullName,
      email: resp.email,
      role: resp.role as UserRole,
      accountStatus: 'ACTIVE',
    };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const registerStudent = async (data: any): Promise<User> => {
    const resp = await api.registerStudent(data);
    setStoredToken(resp.accessToken);
    setToken(resp.accessToken);

    const newUser: User = {
      id: resp.userId,
      fullName: resp.fullName,
      email: resp.email,
      role: 'STUDENT',
      accountStatus: 'ACTIVE',
    };
    setUser(newUser);
    return newUser;
  };

  const registerCompany = async (data: any): Promise<User> => {
    const resp = await api.registerCompany(data);
    setStoredToken(resp.accessToken);
    setToken(resp.accessToken);

    const newUser: User = {
      id: resp.userId,
      fullName: resp.fullName,
      email: resp.email,
      role: 'COMPANY',
      accountStatus: 'ACTIVE',
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    registerStudent,
    registerCompany,
    logout,
    refreshUser,
    isAuthenticated: !!user && !!token,
    isStudent: user?.role === 'STUDENT',
    isCompany: user?.role === 'COMPANY',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

