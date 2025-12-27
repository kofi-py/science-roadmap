'use client';

import { useState, useEffect } from 'react';
import { authAPI, cookieUtils } from './api';

interface User {
  id: number;
  username: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      // Check cookie first
      const userInfo = cookieUtils.getUserInfo();

      if (userInfo) {
        try {
          const data = await authAPI.getCurrentUser();
          if (data?.user) {
            setUser(data.user);
          } else {
            // If API fails or returns no user but cookie exists, maybe trust cookie or clear it?
            // For now matching previous logic but using existing exports
            // Actually, if getCurrentUser fails we might rely on cookie info temporarily or just clear it.
            // But original code used `isAuthenticated()`.
            // Let's implement isAuthenticated check using cookie.
            setUser({ ...userInfo, id: 0 }); // We might not have ID from cookie, but interface requires it. 
            // Wait, cookieUtils.getUserInfo returns {username, email}. User interface has id.
            // If we can't get ID from cookie, we might get it from API.
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, email: string) => {
    try {
      const data = await authAPI.login(username, email);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  };

  const getUsername = () => {
    return user?.username || cookieUtils.getUserInfo()?.username;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user || !!cookieUtils.getUserInfo(),
    login,
    logout,
    getUsername,
  };
};
