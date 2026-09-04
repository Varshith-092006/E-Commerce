import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAccessToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attempt refresh token session bootstrap on initial load
  useEffect(() => {
    async function bootstrapSession() {
      try {
        const result = await apiRequest('/auth/refresh', { method: 'POST' });
        if (result?.accessToken) {
          setAccessToken(result.accessToken);
          const profile = await apiRequest('/users/me');
          setUser(profile);
        }
      } catch {
        // No active refresh session
      } finally {
        setLoading(false);
      }
    }

    bootstrapSession();
  }, []);

  const login = async (email, password) => {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  };

  const register = async (payload) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: payload,
    });
  };

  const verifyEmail = async (email, otp) => {
    return apiRequest('/auth/verify', {
      method: 'POST',
      body: { email, otp },
    });
  };

  const resendVerification = async (email) => {
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: { email },
    });
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  };

  const resetPassword = async (email, token, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { email, token, newPassword },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
