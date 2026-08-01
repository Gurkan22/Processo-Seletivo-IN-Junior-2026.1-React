import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from './auth-context';
import type { User, LoginData, SignupData } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('@Filminhos:user');
    const storedToken = localStorage.getItem('@Filminhos:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoaded(true);
  }, []);

  const login = async (credentials: LoginData) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user: userData } = response.data.data;

    localStorage.setItem('@Filminhos:token', token);
    localStorage.setItem('@Filminhos:user', JSON.stringify(userData));

    setUser(userData);
    navigate('/');
  };

  const signup = async (userData: SignupData) => {
    const response = await api.post('/auth/signup', userData);
    const { token, user: newUser } = response.data.data;

    localStorage.setItem('@Filminhos:token', token);
    localStorage.setItem('@Filminhos:user', JSON.stringify(newUser));

    setUser(newUser);
    navigate('/');
  };

  const logout = () => {
    api.post('/account/logout').catch(() => {});
    localStorage.removeItem('@Filminhos:token');
    localStorage.removeItem('@Filminhos:user');
    setUser(null);
    navigate('/login');
  };

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
