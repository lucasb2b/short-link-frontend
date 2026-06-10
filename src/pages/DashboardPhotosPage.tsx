import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Check, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardPhotosPage() {
  const { photos, isCopiedId, handleDeletePhoto, handleOpenPhotoModal, handleCopyText } = useApp();
  const navigate = useNavigate();

  const [photosPage, setPhotosPage] = useState(1);
  const photosPerPage = 10;
  const totalPhotosPages = Math.ceil(photos.length / photosPerPage) || 1;
  const safePhotosPage = Math.min(Math.max(1, photosPage), totalPhotosPages);
  const paginatedPhotos = photos.slice(
    (safePhotosPage - 1) * photosPerPage,
    safePhotosPage * photosPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-black text-2xl text-primary">Minhas Fotos Hospedadas</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Guarde, baixe e copie links diretos HTML das suas imagens
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-surface font-semibold text-xs rounded-xl hover:bg-primary-container transition flex items-center space-x-1 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Hospedar Outra</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-outline-variant/60 italic text-on-surface-variant text-sm font-medium">
          Sua galeria de fotos está vazia, sô! Suba um retrato lindo clicando no painel.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {paginatedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div
                  onClick={() => handleOpenPhotoModal(photo)}
                  className="relative aspect-video overflow-hidden bg-surface-container cursor-pointer group/img"
                  title="Clique para ver imagem e detalhes"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span
                    className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs text-white ${
                      photo.isPrivate ? 'bg-error/80' : 'bg-tertiary/80'
                    }`}
                  >
                    {photo.isPrivate ? 'Privado 🔒' : 'Público 🌍'}
                  </span>
                  <span className="absolute top-2 right-2 bg-black/60 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {photo.size}
                  </span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface/90 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm scale-90 group-hover/img:scale-100 transition-transform">
                      Ver Detalhes 🔍
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div onClick={() => handleOpenPhotoModal(photo)} className="cursor-pointer group/title" title="Clique para ver detalhes">
                    <h4 className="text-xs font-serif font-extrabold text-primary truncate group-hover/title:text-secondary group-hover/title:underline transition" title={photo.fileName}>
                      {photo.fileName}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant p-1 bg-surface-container rounded-sm font-mono mt-1 font-bold truncate">
                      {photo.imageUrl.startsWith('data:') ? 'Memória Local Simulado' : photo.imageUrl}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-surface-container">
                    <button
                      onClick={() => handleOpenPhotoModal(photo)}
                      className="text-[10px] font-extrabold text-primary hover:text-secondary hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span>Abrir Links HTML</span>
                      <span>🔍</span>
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopyText(photo.imageUrl, photo.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          isCopiedId === photo.id
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
              Mostrando {(safePhotosPage - 1) * photosPerPage + 1} a{' '}
              {Math.min(safePhotosPage * photosPerPage, photos.length)} de o total de{' '}
              {photos.length} retratos
            </span>
            {totalPhotosPages > 1 && (
              <div className="flex items-center space-x-1 flex-wrap gap-1">
                <button
                  disabled={safePhotosPage === 1}
                  onClick={() => setPhotosPage((p) => Math.max(1, p - 1))}
                  className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${
                    safePhotosPage === 1
                      ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                      : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                  }`}
                >
                  Voltar Trem
                </button>
                {Array.from({ length: totalPhotosPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotosPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border ${
                      safePhotosPage === i + 1
                        ? 'bg-primary border-primary text-surface font-black'
                        : 'border-outline-variant hover:bg-surface-container-high/60 text-primary bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={safePhotosPage === totalPhotosPages}
                  onClick={() => setPhotosPage((p) => Math.min(totalPhotosPages, p + 1))}
                  className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${
                    safePhotosPage === totalPhotosPages
                      ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                      : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                  }`}
                >
                  Tocar Diante
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
