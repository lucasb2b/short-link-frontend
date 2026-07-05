import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getUserImagesAPI, uploadImageAPI, deleteImageAPI, toggleImageVisibilityAPI } from '../services/api';
import { PhotoItem } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface PhotoContextType {
  photos: PhotoItem[];
  totalPhotosPages: number;
  totalPhotos: number;
  selectedPhoto: PhotoItem | null;
  isPhotoModalOpen: boolean;
  selectedDashboardPhoto: PhotoItem | null;
  fetchUserImages: (page?: number) => Promise<void>;
  handleUploadPhoto: (file: File, tags: string[], isPrivate: boolean) => Promise<PhotoItem>;
  handleDeletePhoto: (id: string) => Promise<void>;
  handleTogglePhotoVisibility: (id: string) => Promise<void>;
  handleSelectPhoto: (photo: PhotoItem | null) => void;
  handleOpenPhotoModal: (photo: PhotoItem) => void;
  handleClosePhotoModal: () => void;
}

const PhotoContext = createContext<PhotoContextType | null>(null);

export function usePhotos(): PhotoContextType {
  const ctx = useContext(PhotoContext);
  if (!ctx) {
    throw new Error('usePhotos must be used within PhotoProvider');
  }
  return ctx;
}

export function PhotoProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [totalPhotosPages, setTotalPhotosPages] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedDashboardPhoto, setSelectedDashboardPhoto] = useState<PhotoItem | null>(null);

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

  useEffect(() => {
    fetchUserImages();
  }, [fetchUserImages]);

  const handleUploadPhoto = useCallback(async (file: File, tags: string[], isPrivate: boolean): Promise<PhotoItem> => {
    const data = await uploadImageAPI(file, tags, isPrivate);
    await fetchUserImages();
    const newPhoto: PhotoItem = {
      id: `photo-${data.shortCode}`,
      imageUrl: data.storageUrl.startsWith('http') ? data.storageUrl : `${window.location.origin}/uploads/${data.storageUrl}`,
      fileName: data.originalFilename,
      size: data.size ? `${(data.size / (1024 * 1024)).toFixed(2)} MB` : 'Desconhecido',
      isPrivate: data.isPrivate ?? false,
      author: currentUser?.name || currentUser?.email || 'Anônimo',
      tags: data.tags || [],
      createdAt: data.createdAt || new Date().toISOString()
    };
    showToast('Foto salva na estação com sucesso!');
    return newPhoto;
  }, [fetchUserImages, currentUser, showToast]);

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

  return (
    <PhotoContext.Provider value={{
      photos, totalPhotosPages, totalPhotos, selectedPhoto,
      isPhotoModalOpen, selectedDashboardPhoto, fetchUserImages,
      handleUploadPhoto, handleDeletePhoto, handleTogglePhotoVisibility,
      handleSelectPhoto, handleOpenPhotoModal, handleClosePhotoModal
    }}>
      {children}
    </PhotoContext.Provider>
  );
}
