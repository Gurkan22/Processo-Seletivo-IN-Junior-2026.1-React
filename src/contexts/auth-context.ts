import { createContext } from 'react';

export interface User {
  id: number;
  fullName: string | null;
  email: string;
  avatarUrl?: string | null;
  initials: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);
