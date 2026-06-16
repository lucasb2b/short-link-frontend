import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginAPI } from '../services/api';
import { LinkItem, PhotoItem } from '../types';
import { INITIAL_LINKS, INITIAL_PHOTOS } from '../data';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// Interface para o playload decodificado do JWT
interface JwtPayload {
  sub: string; //email
  iat: number;
  exp: number;
}

export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface RegisteredUser extends User {
  password: string;
}

export interface AppContextType {
  // Data
  links: LinkItem[];
  photos: PhotoItem[];
  // Auth
  currentUser: User | null;
  registeredUsers: RegisteredUser[];
  // UI state
  toastMessage: string | null;
  isCopiedId: string | null;
  // Selected states
  selectedPhoto: PhotoItem | null;
  redirectingLink: LinkItem | null;
  isStatsModalOpen: boolean;
  selectedStatsLink: LinkItem | null;
  isPhotoModalOpen: boolean;
  selectedDashboardPhoto: PhotoItem | null;
  // Actions - links
  handleShortenLink: (originalUrl: string) => Promise<LinkItem>;
  handleDeleteLink: (id: string) => void;
  triggerRedirect: (link: LinkItem) => void;
  handleCopyText: (text: string, id: string) => void;
  handleOpenStatsModal: (link: LinkItem) => void;
  handleCloseStatsModal: () => void;
  // Actions - photos
  handleUploadPhoto: (photoData: Omit<PhotoItem, 'id' | 'createdAt'>) => Promise<PhotoItem>;
  handleDeletePhoto: (id: string) => void;
  handleSelectPhoto: (photo: PhotoItem | null) => void;
  handleOpenPhotoModal: (photo: PhotoItem) => void;
  handleClosePhotoModal: () => void;
  // Actions - auth
  handleLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  handleSignup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  handleLogout: () => void;
  handleUpdateProfile: (data: { name?: string; password?: string; avatarUrl?: string }) => void;
  handleDeleteAccount: () => void;
  // Toast
  showToast: (message: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context creation
// ─────────────────────────────────────────────────────────────────────────────

export const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ── Persisted data states ──────────────────────────────────────────────────
  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('tremz_links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('tremz_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  // Estado do usuário atual
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Ao iniciar, tenta restaurar o usuário a partir do token salvo
    const token = localStorage.getItem('tremz_token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Verifica se o token não está expirado (exp em segundos)
        if (decoded.exp * 1000 > Date.now()) {
          return { email: decoded.sub, name: '', avatarUrl: '' };
        } else {
          // Token expirado: remove
          localStorage.removeItem('tremz_token');
        }
      } catch {
        localStorage.removeItem('tremz_token');
      }
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('tremz_users');
    const initial: RegisteredUser[] = [
      { email: 'lucasbritocientista@gmail.com', name: 'Lucas Brito', password: '123' },
      { email: 'admin@admin.com', name: 'Admin', password: 'admin123' },
    ];
    if (!saved) {
      localStorage.setItem('tremz_users', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  });

  // ── UI states ──────────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [redirectingLink, setRedirectingLink] = useState<LinkItem | null>(null);

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedStatsLink, setSelectedStatsLink] = useState<LinkItem | null>(null);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedDashboardPhoto, setSelectedDashboardPhoto] = useState<PhotoItem | null>(null);

  // ── localStorage sync ──────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('tremz_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('tremz_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    if (currentUser) {
      // Se você quiser persistir o nome/avatar, pode salvar separadamente,
      // mas o token é a fonte da verdade para o login
    } else {
      localStorage.removeItem('tremz_token');
    }
  }, [currentUser]);

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // ── Link actions ───────────────────────────────────────────────────────────
  const handleShortenLink = useCallback(async (originalUrl: string): Promise<LinkItem> => {
    const randomPath = Math.random().toString(36).substring(2, 8);
    const newLink: LinkItem = {
      id: Date.now().toString(),
      originalUrl,
      shortUrl: `tremz.in/${randomPath}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
      trend: 'stable',
    };
    setLinks((prev) => [newLink, ...prev]);
    showToast('Trem encurtado com sucesso, uai!');
    return newLink;
  }, [showToast]);

  const handleDeleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Link removido do painel!');
  }, [showToast]);

  const triggerRedirect = useCallback((link: LinkItem) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, clicks: l.clicks + 1, trend: 'up' } : l))
    );
    setRedirectingLink(link);
  }, []);

  const handleCopyText = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 3000);
  }, []);

  const handleOpenStatsModal = useCallback((link: LinkItem) => {
    setSelectedStatsLink(link);
    setIsStatsModalOpen(true);
  }, []);

  const handleCloseStatsModal = useCallback(() => {
    setIsStatsModalOpen(false);
    setSelectedStatsLink(null);
  }, []);

  // ── Photo actions ──────────────────────────────────────────────────────────
  const handleUploadPhoto = useCallback(async (
    photoData: Omit<PhotoItem, 'id' | 'createdAt'>
  ): Promise<PhotoItem> => {
    const newPhoto: PhotoItem = {
      ...photoData,
      id: `photo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    showToast('Sua foto foi hospedada!');
    return newPhoto;
  }, [showToast]);

  const handleDeletePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Foto excluída da estação!');
  }, [showToast]);

  const handleSelectPhoto = useCallback((photo: PhotoItem | null) => {
    setSelectedPhoto(photo);
    if (photo) {
      const url = new URL(window.location.href);
      url.searchParams.set('photo', photo.id.replace('photo-', ''));
      window.history.pushState({}, '', url.pathname + url.search);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('photo');
      url.searchParams.delete('foto');
      window.history.pushState({}, '', url.pathname + url.search);
    }
  }, []);

  const handleOpenPhotoModal = useCallback((photo: PhotoItem) => {
    setSelectedDashboardPhoto(photo);
    setIsPhotoModalOpen(true);
  }, []);

  const handleClosePhotoModal = useCallback(() => {
    setIsPhotoModalOpen(false);
    setSelectedDashboardPhoto(null);
  }, []);

  // ── Auth actions ───────────────────────────────────────────────────────────
  const handleLogin = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email || !password) {
        return { success: false, error: 'Preencha os campos obrigatórios primeiro!' };
      }
      try {
        // 1. Chama a API e obtém o token
        const token = await loginAPI(email, password);

        // 2. Decodifica o token para pegar o e‑mail
        const decoded = jwtDecode<JwtPayload>(token);

        // 3. Salva o token no localStorage
        localStorage.setItem('tremz_token', token);

        // 4. Define o usuário atual (aqui você pode manter o nome vazio
        //    ou buscar de uma rota /me depois)
        setCurrentUser({
          email: decoded.sub,
          name: '', // futuramente pode vir de outro endpoint
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
    (name: string, email: string, password: string): { success: boolean; error?: string } => {
      if (!name || !email || !password) {
        return { success: false, error: 'Preencha todos os campos do cadastro do trem!' };
      }
      const exists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: 'Uai, esse e-mail já tá cadastrado aqui na estação.' };
      }
      const newUser: RegisteredUser = { name, email, password, avatarUrl: '' };
      const updated = [...registeredUsers, newUser];
      setRegisteredUsers(updated);
      localStorage.setItem('tremz_users', JSON.stringify(updated));
      setCurrentUser({ email, name, avatarUrl: '' });
      showToast('Registrado com sucesso, sô!');
      return { success: true };
    },
    [registeredUsers, showToast]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem('tremz_token');
    setCurrentUser(null);
    showToast('Saiu da estação. Volte logo, sô!');
  }, [showToast]);

  const handleUpdateProfile = useCallback(
    (updatedData: { name?: string; password?: string; avatarUrl?: string }) => {
      if (!currentUser) return;
      setRegisteredUsers((prev) => {
        const users = [...prev];
        const idx = users.findIndex((u) => u.email === currentUser.email);
        if (idx > -1) {
          if (updatedData.name) users[idx].name = updatedData.name;
          if (updatedData.password) users[idx].password = updatedData.password;
          if (updatedData.avatarUrl !== undefined) users[idx].avatarUrl = updatedData.avatarUrl;
          localStorage.setItem('tremz_users', JSON.stringify(users));
        }
        return users;
      });
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        if (updatedData.name) next.name = updatedData.name;
        if (updatedData.avatarUrl !== undefined) next.avatarUrl = updatedData.avatarUrl;
        return next;
      });
      showToast('Configurações atualizadas, sô!');
    },
    [currentUser, showToast]
  );

  const handleDeleteAccount = useCallback(() => {
    if (!currentUser) return;
    setRegisteredUsers((prev) => {
      const updated = prev.filter((u) => u.email !== currentUser.email);
      localStorage.setItem('tremz_users', JSON.stringify(updated));
      return updated;
    });
    setCurrentUser(null);
    showToast('Sua conta foi excluída com sucesso. Sentiremos sua falta por aqui, sô!');
  }, [currentUser, showToast]);

  // ── Context value ──────────────────────────────────────────────────────────
  const value: AppContextType = {
    links,
    photos,
    currentUser,
    registeredUsers,
    toastMessage,
    isCopiedId,
    selectedPhoto,
    redirectingLink,
    isStatsModalOpen,
    selectedStatsLink,
    isPhotoModalOpen,
    selectedDashboardPhoto,
    handleShortenLink,
    handleDeleteLink,
    triggerRedirect,
    handleCopyText,
    handleOpenStatsModal,
    handleCloseStatsModal,
    handleUploadPhoto,
    handleDeletePhoto,
    handleSelectPhoto,
    handleOpenPhotoModal,
    handleClosePhotoModal,
    handleLogin,
    handleSignup,
    handleLogout,
    handleUpdateProfile,
    handleDeleteAccount,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
