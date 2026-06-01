import { createContext, useContext, useState, useEffect } from 'react';
import {
  saveToken, getToken, deleteToken,
  saveUser, getUser, deleteUser,
} from '../utils/storage';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth state from storage on app launch
  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([getToken(), getUser()]);
        if (t && u) {
          setToken(t);
          setUser(u);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password);
    await Promise.all([saveToken(data.token), saveUser(data.user)]);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await apiRegister(name, email, password);
    await Promise.all([saveToken(data.token), saveUser(data.user)]);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await Promise.all([deleteToken(), deleteUser()]);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
