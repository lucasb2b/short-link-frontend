import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Check, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { usePhotos } from '../contexts/PhotoContext';
import { useToast } from '../contexts/ToastContext';

export default function DashboardPhotosPage() {
  const { t } = useTranslation();
  const {
    photos,
    totalPhotos,
    totalPhotosPages,
    fetchUserImages,
    handleDeletePhoto,
    handleOpenPhotoModal,
    handleTogglePhotoVisibility
  } = usePhotos();
  const { handleCopyText, isCopiedId } = useToast();
  const navigate = useNavigate();

  const [photosPage, setPhotosPage] = useState(1);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);
  const photosPerPage = 10;

  React.useEffect(() => {
    fetchUserImages(photosPage - 1);
  }, [photosPage, fetchUserImages]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-black text-2xl text-primary">{t('dashboard.photos.title')}</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {t('dashboard.photos.subtitle')}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-surface font-semibold text-xs rounded-xl hover:bg-primary-container transition flex items-center space-x-1 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('dashboard.photos.hostAnother')}</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-outline-variant/60 italic text-on-surface-variant text-sm font-medium">
          {t('dashboard.photos.emptyState')}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div
                  onClick={() => navigate(`/i/${photo.id.replace('photo-', '')}`)}
                  className="relative aspect-video overflow-hidden bg-surface-container cursor-pointer group/img"
                  title={t('dashboard.photos.clickToViewDetails')}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span
                    className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs text-white ${photo.isPrivate ? 'bg-error/80' : 'bg-tertiary/80'
                      }`}
                  >
                    {photo.isPrivate ? t('dashboard.photos.privateBadge') : t('dashboard.photos.publicBadge')}
                  </span>
                  <span className="absolute top-2 right-2 bg-black/60 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {photo.size}
                  </span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface/90 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm scale-90 group-hover/img:scale-100 transition-transform">
                      {t('dashboard.photos.viewDetails')}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div onClick={() => navigate(`/i/${photo.id.replace('photo-', '')}`)} className="cursor-pointer group/title" title={t('dashboard.photos.clickForDetails')}>
                    <h4 className="text-xs font-serif font-extrabold text-primary truncate group-hover/title:text-secondary group-hover/title:underline transition" title={photo.fileName}>
                      {photo.fileName}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant p-1 bg-surface-container rounded-sm font-mono mt-1 font-bold truncate">
                      {photo.imageUrl.startsWith('data:') ? t('dashboard.photos.localMemSimulated') : `${window.location.origin}/i/${photo.id.replace('photo-', '')}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-surface-container">
                    {/* Toggle de visibilidade */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTogglingIds((prev) => [...prev, photo.id]);
                        handleTogglePhotoVisibility(photo.id).finally(() =>
                          setTogglingIds((prev) => prev.filter((id) => id !== photo.id))
                        );
                      }}
                      disabled={togglingIds.includes(photo.id)}
                      className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-lg border transition cursor-pointer ${togglingIds.includes(photo.id)
                        ? 'opacity-50 cursor-wait'
                        : photo.isPrivate
                          ? 'text-error border-error/30 bg-error/5 hover:bg-error/10'
                          : 'text-tertiary border-tertiary/30 bg-tertiary/5 hover:bg-tertiary/10'
                        }`}
                      title={photo.isPrivate ? t('dashboard.photos.togglePublic') : t('dashboard.photos.togglePrivate')}
                    >
                      {togglingIds.includes(photo.id) ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : photo.isPrivate ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      <span>{photo.isPrivate ? t('dashboard.photos.privateLabel') : t('dashboard.photos.publicLabel')}</span>
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopyText(`${window.location.origin}/i/${photo.id.replace('photo-', '')}`, photo.id)}
                        className={`p-1.5 rounded-lg border transition ${isCopiedId === photo.id
                          ? 'bg-tertiary/10 text-tertiary border-tertiary-container'
                          : 'bg-surface-container-high/60 border-outline-variant/40 hover:bg-surface-container-high text-primary'
                          }`}
                      >
                        {isCopiedId === photo.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-1.5 bg-error-container/10 border border-error-container/20 text-error hover:bg-error-container/20 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 bg-white border border-outline-variant/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-on-surface-variant font-medium">
              {t('dashboard.photos.paginationShowing', {
                from: totalPhotos === 0 ? 0 : (photosPage - 1) * photosPerPage + 1,
                to: Math.min(photosPage * photosPerPage, totalPhotos),
                total: totalPhotos
              })}
            </span>
            {totalPhotosPages > 1 && (
              <div className="flex items-center space-x-1 flex-wrap gap-1">
                <button
                  disabled={photosPage === 1}
                  onClick={() => setPhotosPage((p) => Math.max(1, p - 1))}
                  className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${photosPage === 1
                    ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                    }`}
                >
                  {t('dashboard.photos.paginationPrev')}
                </button>
                {Array.from({ length: totalPhotosPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotosPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border ${photosPage === i + 1
                      ? 'bg-primary border-primary text-surface font-black'
                      : 'border-outline-variant hover:bg-surface-container-high/60 text-primary bg-white'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={photosPage === totalPhotosPages}
                  onClick={() => setPhotosPage((p) => Math.min(totalPhotosPages, p + 1))}
                  className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${photosPage === totalPhotosPages
                    ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                    }`}
                >
                  {t('dashboard.photos.paginationNext')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}