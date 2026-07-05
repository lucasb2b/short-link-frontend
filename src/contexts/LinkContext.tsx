import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getUserLinksAPI, shortenLinkAPI, revokeLinkAPI } from '../services/api';
import { LinkItem } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface LinkContextType {
  links: LinkItem[];
  totalLinksPages: number;
  totalLinks: number;
  redirectingLink: LinkItem | null;
  isStatsModalOpen: boolean;
  selectedStatsLink: LinkItem | null;
  fetchUserLinks: (page?: number) => Promise<void>;
  handleShortenLink: (originalUrl: string) => Promise<LinkItem>;
  handleDeleteLink: (id: string) => Promise<void>;
  triggerRedirect: (link: LinkItem) => void;
  handleOpenStatsModal: (link: LinkItem) => void;
  handleCloseStatsModal: () => void;
}

const LinkContext = createContext<LinkContextType | null>(null);

export function useLinks(): LinkContextType {
  const ctx = useContext(LinkContext);
  if (!ctx) {
    throw new Error('useLinks must be used within LinkProvider');
  }
  return ctx;
}

export function LinkProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [totalLinksPages, setTotalLinksPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);

  const [redirectingLink, setRedirectingLink] = useState<LinkItem | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedStatsLink, setSelectedStatsLink] = useState<LinkItem | null>(null);

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

  useEffect(() => {
    if (currentUser) {
      fetchUserLinks();
    } else {
      setLinks([]);
      setTotalLinksPages(1);
      setTotalLinks(0);
    }
  }, [currentUser, fetchUserLinks]);

  const handleShortenLink = useCallback(async (originalUrl: string): Promise<LinkItem> => {
    const data = await shortenLinkAPI(originalUrl);
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

  const handleOpenStatsModal = useCallback((link: LinkItem) => {
    setSelectedStatsLink(link);
    setIsStatsModalOpen(true);
  }, []);

  const handleCloseStatsModal = useCallback(() => {
    setIsStatsModalOpen(false);
    setSelectedStatsLink(null);
  }, []);

  return (
    <LinkContext.Provider value={{
      links, totalLinksPages, totalLinks, redirectingLink,
      isStatsModalOpen, selectedStatsLink, fetchUserLinks,
      handleShortenLink, handleDeleteLink, triggerRedirect,
      handleOpenStatsModal, handleCloseStatsModal
    }}>
      {children}
    </LinkContext.Provider>
  );
}
