import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { changePasswordAPI, loginAPI, registerAPI, deactivateAccountAPI, updateProfileAPI, shortenLinkAPI, getUserLinksAPI, revokeLinkAPI, getLinkAnalyticsAPI, uploadImageAPI, getUserImagesAPI, deleteImageAPI, toggleImageVisibilityAPI } from '../services/api';
import { LinkItem, PhotoItem } from '../types';
import { INITIAL_LINKS, INITIAL_PHOTOS } from '../data';

const USER_PROFILE_KEY = 'tremz_user_profile';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// Interface para o playload decodificado do JWT
interface JwtPayload {
  sub: string; //email
  name?: string;
  iat: number;
  exp: number;
}

export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AppContextType {
  // Data
  links: LinkItem[];
  photos: PhotoItem[];
  totalLinksPages: number;
  totalLinks: number;
  totalPhotosPages: number;
  totalPhotos: number;
  // Auth
  currentUser: User | null;
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
  // Fetches
  fetchUserLinks: (page?: number) => Promise<void>;
  fetchUserImages: (page?: number) => Promise<void>;
  // Actions - links
  handleShortenLink: (originalUrl: string) => Promise<LinkItem>;
  handleDeleteLink: (id: string) => Promise<void>;
  triggerRedirect: (link: LinkItem) => void;
  handleCopyText: (text: string, id: string) => void;
  handleOpenStatsModal: (link: LinkItem) => void;
  handleCloseStatsModal: () => void;
  // Actions - photos
  handleUploadPhoto: (file: File, tags: string[], isPrivate: boolean) => Promise<PhotoItem>;
  handleDeletePhoto: (id: string) => Promise<void>;
  handleTogglePhotoVisibility: (id: string) => Promise<void>;
  handleSelectPhoto: (photo: PhotoItem | null) => void;
  handleOpenPhotoModal: (photo: PhotoItem) => void;
  handleClosePhotoModal: () => void;
  // Actions - auth
  handleLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  handleSignup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => void;
  handleUpdateProfile: (data: { name?: string; password?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  handleDeleteAccount: () => Promise<void>;
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
  const [links, setLinks] = useState<LinkItem[]>([]);

  // Estado do usuário atual
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const token = localStorage.getItem('tremz_token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          // Tenta carregar perfil salvo (nome/avatar)
          const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
          const profile = savedProfile ? JSON.parse(savedProfile) : {};
          return {
            email: decoded.sub,
            name: profile.name || decoded.name || '',   // prioridade: salvo > token > vazio
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

  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const [totalLinksPages, setTotalLinksPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalPhotosPages, setTotalPhotosPages] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);

  // ── UI states ──────────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [redirectingLink, setRedirectingLink] = useState<LinkItem | null>(null);

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedStatsLink, setSelectedStatsLink] = useState<LinkItem | null>(null);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedDashboardPhoto, setSelectedDashboardPhoto] = useState<PhotoItem | null>(null);

  const fetchUserLinks = useCallback(async (page: number = 0) => {
    if (!currentUser) return;
    try {
      const data = await getUserLinksAPI(page); 
      
      const mappedLinks: LinkItem[] = data.content.map((item: any) => {
        return {
          id: item.shortCode,
          originalUrl: item.originalUrl,
          shortUrl: item.shortUrl,
          clicks: item.clicks || 0,
          createdAt: item.createdAt || new Date().toISOString(),
          trend: 'stable' as const,
        };
      });
      
      setLinks(mappedLinks);
      setTotalLinksPages(data.totalPages || 1);
      setTotalLinks(data.totalElements || 0);
    } catch (error) {
      console.error('Erro ao buscar links do usuário', error);
    }
  }, [currentUser]);

  const fetchUserImages = useCallback(async (page: number = 0) => {
    if (!currentUser) {
      setPhotos([]);
      setTotalPhotosPages(1);
      setTotalPhotos(0);
      return;
    }
    try {
      const data = await getUserImagesAPI(page); 
      
      const mappedPhotos: PhotoItem[] = data.content.map((item: any) => ({
        id: `photo-${item.shortCode}`,
        imageUrl: item.storageUrl.startsWith('http') ? item.storageUrl : `${window.location.origin}/uploads/${item.storageUrl}`,
        fileName: item.originalFilename,
        size: item.size ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : 'Desconhecido',
        isPrivate: item.isPrivate ?? false,
        author: currentUser.name || currentUser.email,
        tags: item.tags || [],
        createdAt: item.createdAt || new Date().toISOString()
      }));

      setPhotos(mappedPhotos);
      setTotalPhotosPages(data.totalPages || 1);
      setTotalPhotos(data.totalElements || 0);
    } catch (error) {
      console.error('Erro ao buscar imagens do usuário', error);
    }
  }, [currentUser]);

  // Handle switching users - reload photos from backend
  useEffect(() => {
    fetchUserImages();
  }, [fetchUserImages]);

  // ── localStorage sync (Only for tokens now) ────────────────────────────────

  useEffect(() => {
    if (currentUser) {
      // Se você quiser persistir o nome/avatar, pode salvar separadamente,
      // mas o token é a fonte da verdade para o login
    } else {
      localStorage.removeItem('tremz_token');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchUserLinks();
    } else {
      setLinks([]); // limpa ao deslogar
    }
  }, [currentUser, fetchUserLinks]);

  // Listener para evento de sessão expirada
  useEffect(() => {
    const handleSessionExpired = () => {
      localStorage.removeItem('tremz_token');
      localStorage.removeItem('tremz_refreshToken');
      localStorage.removeItem(USER_PROFILE_KEY);
      setCurrentUser(null);
      showToast('Sessão expirada. Por favor, faça login novamente.');
    };
    window.addEventListener('sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, []);


  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // ── Link actions ───────────────────────────────────────────────────────────
  const handleShortenLink = useCallback(async (originalUrl: string): Promise<LinkItem> => {
    const data = await shortenLinkAPI(originalUrl);
    // Recarrega a lista do backend (já inclui o novo link)
    await fetchUserLinks();
    const newLink: LinkItem = {
      id: data.shortCode,
      originalUrl: data.originalUrl,
      shortUrl: data.shortUrl,
      clicks: 0,
      createdAt: new Date().toISOString(),
      trend: 'stable',
    };
    showToast('Trem encurtado com sucesso, uai!');
    return newLink;
  }, [fetchUserLinks, showToast]);

  const handleDeleteLink = useCallback(async (shortCode: string) => {
    try {
      await revokeLinkAPI(shortCode);
      // Remove da lista local imediatamente
      setLinks((prev) => prev.filter((l) => l.id !== shortCode));
      showToast('Link removido do trilho, sô!');
    } catch (error: any) {
      showToast(error.message || 'Erro ao remover link.');
    }
  }, [showToast]);

  const triggerRedirect = useCallback((link: LinkItem) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, clicks: l.clicks + 1, trend: 'up' } : l))
    );
    setRedirectingLink(link);
  }, []);

  const handleCopyText = useCallback((text: string, id: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopiedId(id);
          setTimeout(() => setIsCopiedId(null), 3000);
          showToast('Copiado para a área de transferência!');
        })
        .catch(() => showToast('Erro ao copiar texto.'));
    } else {
      // Fallback para HTTP (acesso local via celular)
      const textArea = document.createElement('textarea');
      textArea.value = text;
      // Evita rolagem da tela para o elemento
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopiedId(id);
        setTimeout(() => setIsCopiedId(null), 3000);
        showToast('Copiado para a área de transferência!');
      } catch (err) {
        showToast('Erro ao copiar texto no celular.');
      }
      document.body.removeChild(textArea);
    }
  }, [showToast]);

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
    file: File,
    tags: string[],
    isPrivate: boolean
  ): Promise<PhotoItem> => {
    try {
      const data = await uploadImageAPI(file, tags, isPrivate);
      
      const newPhoto: PhotoItem = {
        id: `photo-${data.shortCode}`,
        fileName: data.originalFilename,
        imageUrl: data.storageUrl, // Renderable URL
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        tags: data.tags || [],
        author: data.isAnonymous ? 'Usuário Não Identificado' : (currentUser?.name || 'Autor Desconhecido'),
        isPrivate: isPrivate,
        createdAt: new Date().toISOString(),
      };
      
      // Update local state if it's meant to be stored in the gallery
      setPhotos((prev) => [newPhoto, ...prev]);
      showToast('Sua foto foi hospedada!');
      
      return newPhoto;
    } catch (error: any) {
      showToast(error.message || 'Erro ao hospedar foto.');
      throw error;
    }
  }, [currentUser, showToast]);

  const handleDeletePhoto = useCallback(async (id: string) => {
    try {
      const shortCode = id.replace('photo-', '');
      await deleteImageAPI(shortCode);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast('Foto excluída da estação!');
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir foto.');
    }
  }, [showToast]);

  const handleTogglePhotoVisibility = useCallback(async (id: string) => {
    try {
      const shortCode = id.replace('photo-', '');
      const data = await toggleImageVisibilityAPI(shortCode);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isPrivate: data.isPrivate } : p
        )
      );
      showToast(data.isPrivate ? 'Foto agora é privada 🔒' : 'Foto agora é pública 🌍');
    } catch (error: any) {
      showToast(error.message || 'Erro ao alterar visibilidade.');
    }
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
        const data = await loginAPI(email, password);
        const token = data.token;
        const refreshToken = data.refreshToken;

        // 2. Decodifica o token para pegar o e‑mail
        const decoded = jwtDecode<JwtPayload>(token);

        // 3. Salva os tokens no localStorage
        localStorage.setItem('tremz_token', token);
        if (refreshToken) {
          localStorage.setItem('tremz_refreshToken', refreshToken);
        }

        // 4. Define o usuário atual (aqui você pode manter o nome vazio
        //    ou buscar de uma rota /me depois)
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
        // Não logamos o usuário automaticamente, pois ele precisa verificar o e-mail.
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
        // 1. Se tiver nome, chama a API para atualizar no banco
        if (_data.name && _data.name !== currentUser.name) {
          await updateProfileAPI(_data.name);
        }

        // 2. Se estiver trocando a senha, chama a API
        if (_data.password && _data.currentPassword) {
          await changePasswordAPI(_data.currentPassword, _data.password);
        }

        // 3. Atualiza o estado local (inclusive avatar, se houver)
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            name: _data.name !== undefined ? _data.name : prev.name,
            avatarUrl: _data.avatarUrl !== undefined ? _data.avatarUrl : prev.avatarUrl,
          };
          // Atualiza o perfil salvo no localStorage
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

  // ── Context value ──────────────────────────────────────────────────────────
    const value: AppContextType = {
    links,
    photos,
    totalLinksPages,
    totalLinks,
    totalPhotosPages,
    totalPhotos,
    currentUser,
    toastMessage,
    isCopiedId,
    selectedPhoto,
    redirectingLink,
    isStatsModalOpen,
    selectedStatsLink,
    isPhotoModalOpen,
    selectedDashboardPhoto,
    fetchUserLinks,
    fetchUserImages,
    handleShortenLink,
    handleDeleteLink,
    triggerRedirect,
    handleCopyText,
    handleOpenStatsModal,
    handleCloseStatsModal,
    handleUploadPhoto,
    handleDeletePhoto,
    handleTogglePhotoVisibility,
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
