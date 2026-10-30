import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { api, getStoredToken, setStoredToken } from '@/services/api';

export const normalizeRole = (role?: string | null): UserRole => {
  if (!role) return 'STUDENT';
  const clean = String(role).replace(/^ROLE_/i, '').trim().toUpperCase();
  if (clean === 'ADMIN' || clean === 'ADMINISTRATOR') return 'ADMIN';
  if (clean === 'COMPANY' || clean === 'EMPLOYER' || clean === 'RECRUITER') return 'COMPANY';
  return 'STUDENT';
};

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('intern_desk_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.role) {
      parsed.role = normalizeRole(parsed.role);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem('intern_desk_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('intern_desk_user');
  }
}

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
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(!getStoredUser() && !!getStoredToken());

  const fetchCurrentUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setStoredUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      const updatedUser: User = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: normalizeRole(data.role),
        accountStatus: data.accountStatus,
        createdAt: data.createdAt,
      };
      setUser(updatedUser);
      setStoredUser(updatedUser);
    } catch (err) {
      console.warn('Session expired or invalid, clearing authentication:', err);
      setStoredToken(null);
      setStoredUser(null);
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
    const cleanRole = normalizeRole(resp.role);

    setStoredToken(resp.accessToken);
    setToken(resp.accessToken);

    const loggedInUser: User = {
      id: resp.userId,
      fullName: resp.fullName,
      email: resp.email,
      role: cleanRole,
      accountStatus: 'ACTIVE',
    };

    setStoredUser(loggedInUser);
    setUser(loggedInUser);
    setLoading(false);
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
    setStoredUser(newUser);
    setUser(newUser);
    setLoading(false);
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
    setStoredUser(newUser);
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setStoredToken(null);
    setStoredUser(null);
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const normalizedUserRole = user ? normalizeRole(user.role) : null;

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
    isStudent: normalizedUserRole === 'STUDENT',
    isCompany: normalizedUserRole === 'COMPANY',
    isAdmin: normalizedUserRole === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
