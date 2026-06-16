import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import authApi from "../api/authApi";
import { tokenStorage } from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      const token = tokenStorage.get();
      if (!token) {
        if (active) {
          setAdmin(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authApi.me();
        const profile = response?.data?.data;
        if (active) {
          setAdmin(profile || null);
        }
      } catch (error) {
        tokenStorage.clear();
        if (active) {
          setAdmin(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    const payload = response.data.data;
    tokenStorage.set(payload.accessToken);
    setAdmin(payload.admin);
    setLoading(false);
    return payload.admin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // ignore logout request errors and clear local auth state
    } finally {
      tokenStorage.clear();
      setAdmin(null);
      setLoading(false);
    }
  }, []);

  const reloadProfile = useCallback(async () => {
    setLoading(true);
    const token = tokenStorage.get();
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await authApi.me();
      const profile = response?.data?.data || null;
      setAdmin(profile);
      return profile;
    } catch (error) {
      tokenStorage.clear();
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      isAuthenticated: Boolean(admin),
      login,
      logout,
      reloadProfile
    }),
    [admin, loading, login, logout, reloadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
