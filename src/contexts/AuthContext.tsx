import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginAPI, registerAPI, deactivateAccountAPI, updateProfileAPI, changePasswordAPI } from '../services/api';
import { useToast } from './ToastContext';
import { User } from '../types';

export const USER_PROFILE_KEY = 'tremz_user_profile';

interface JwtPayload {
  sub: string; //email
  name?: string;
  iat: number;
  exp: number;
}

export interface AuthContextType {
  currentUser: User | null;
  handleLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  handleSignup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => void;
  handleUpdateProfile: (data: { name?: string; password?: string; avatarUrl?: string; currentPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  handleDeleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const token = localStorage.getItem('tremz_token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
          const profile = savedProfile ? JSON.parse(savedProfile) : {};
          return {
            email: decoded.sub,
            name: profile.name || decoded.name || '',
            avatarUrl: profile.avatarUrl || '',
          };
        } else {
          localStorage.removeItem('tremz_token');
          localStorage.removeItem('tremz_refreshToken');
        }
      } catch {
        localStorage.removeItem('tremz_token');
        localStorage.removeItem('tremz_refreshToken');
      }
    }
    return null;
  });

  const handleLogin = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email || !password) {
        return { success: false, error: 'Preencha os campos obrigatórios primeiro!' };
      }
      try {
        const data = await loginAPI(email, password);
        const token = data.token;
        const refreshToken = data.refreshToken;

        const decoded = jwtDecode<JwtPayload>(token);

        localStorage.setItem('tremz_token', token);
        if (refreshToken) {
          localStorage.setItem('tremz_refreshToken', refreshToken);
        }

        setCurrentUser({
          email: decoded.sub,
          name: decoded.name || decoded.sub.split('@')[0],
          avatarUrl: '',
        });

        showToast(`Bem-vindo à estação, ${decoded.sub}!`);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Erro ao fazer login.' };
      }
    },
    [showToast]
  );

  const handleSignup = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!name || !email || !password) {
        return { success: false, error: 'Preencha todos os campos do cadastro do trem!' };
      }
      try {
        await registerAPI(name, email, password);
        showToast('Cadastro criado! Verifique seu e‑mail para ativar a conta.');
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Erro ao criar conta.' };
      }
    },
    [showToast]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem('tremz_token');
    localStorage.removeItem('tremz_refreshToken');
    localStorage.removeItem(USER_PROFILE_KEY);
    setCurrentUser(null);
    showToast('Saiu da estação. Volte logo, sô!');
  }, [showToast]);

  const handleUpdateProfile = useCallback(
    async (_data: { name?: string; password?: string; avatarUrl?: string; currentPassword?: string }) => {
      if (!currentUser) return { success: false, error: 'Usuário não autenticado.' };
      try {
        if (_data.name && _data.name !== currentUser.name) {
          await updateProfileAPI(_data.name);
        }

        if (_data.password && _data.currentPassword) {
          await changePasswordAPI(_data.currentPassword, _data.password);
        }

        setCurrentUser((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            name: _data.name !== undefined ? _data.name : prev.name,
            avatarUrl: _data.avatarUrl !== undefined ? _data.avatarUrl : prev.avatarUrl,
          };
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({
            name: updated.name,
            avatarUrl: updated.avatarUrl,
          }));
          return updated;
        });

        showToast('Perfil atualizado com sucesso!');
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Erro ao atualizar perfil.' };
      }
    },
    [currentUser, showToast]
  );

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deactivateAccountAPI();
      localStorage.removeItem('tremz_token');
      setCurrentUser(null);
      showToast('Sua conta foi desativada. Até mais, sô!');
    } catch (error: any) {
      showToast(error.message || 'Erro ao desativar conta.');
    }
  }, [showToast]);

  return (
    <AuthContext.Provider value={{ currentUser, handleLogin, handleSignup, handleLogout, handleUpdateProfile, handleDeleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
