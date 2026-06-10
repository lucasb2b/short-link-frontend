import React, { useState } from 'react';
import { Tag, Search, Calendar, User, ArrowUpRight, Copy, Check, Download, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';

interface PublicGalleryProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
}

export default function PublicGallery({ photos, onSelectPhoto }: PublicGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags (only from public photos)
  const uniqueTags = Array.from(
    new Set(photos.filter(p => !p.isPrivate).flatMap((p) => p.tags || []))
  );

  const filteredPhotos = photos.filter((photo) => {
    if (photo.isPrivate) return false;

    const matchesSearch =
      photo.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag ? photo.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-black text-2xl text-primary flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-secondary" />
            <span>Retratos Recentes do Povo</span>
          </h3>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Mural público de fotos hospedadas pelos mineiros da estação.
          </p>
        </div>

        {/* Searching input */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou fotógrafo..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-outline-variant rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder-on-surface-variant/60"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
        </div>
      </div>

      {/* Tags Filter Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-primary italic uppercase tracking-wider">Categorias:</span>
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedTag === null
              ? 'bg-primary text-surface'
              : 'bg-surface-container-high/60 text-primary hover:bg-surface-container-high'
          }`}
        >
          Tudo
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              tag === selectedTag
                ? 'bg-secondary text-surface'
                : 'bg-surface-container-high/60 text-primary hover:bg-surface-container-high'
            }`}
          >
            <span>#{tag}</span>
          </button>
        ))}
      </div>

      {/* Photos Grid listing */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-surface-container/30 border border-dashed border-outline-variant rounded-2xl p-12 text-center text-on-surface-variant text-sm font-medium italic">
          Buscamos de ponta a ponta e não achamos nenhum trem com essa busca! Tente limpar os filtros, sô.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo frame container */}
                <div 
                  onClick={() => onSelectPhoto(photo)}
                  className="relative aspect-square overflow-hidden cursor-pointer"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle black scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center space-x-1">
                      <span>Ver Retrato e Links</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Size float Badge */}
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {photo.size}
                  </span>
                </div>

                {/* Info block */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 
                      onClick={() => onSelectPhoto(photo)}
                      className="text-sm font-serif font-extrabold text-primary hover:text-secondary cursor-pointer truncate"
                      title={photo.fileName}
                    >
                      {photo.fileName}
                    </h4>
                    <div className="flex items-center space-x-1.5 text-[11px] text-on-surface-variant">
                      <User className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="truncate italic font-medium">{photo.author}</span>
                    </div>
                  </div>

                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="text-[9px] font-mono font-bold bg-surface-container-high text-primary px-1.5 py-0.5 rounded-md border border-outline-variant/30 cursor-pointer hover:bg-secondary hover:text-white transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
