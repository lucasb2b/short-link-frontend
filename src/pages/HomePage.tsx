import React, { useState } from 'react';
import { Link2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import LinkShortener from '../components/LinkShortener';
import PhotoUploader from '../components/PhotoUploader';
import PublicGallery from '../components/PublicGallery';

export default function HomePage() {
  const { handleShortenLink, handleUploadPhoto, photos, handleSelectPhoto, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'link' | 'photo'>('link');

  return (
    <motion.div
      key="home-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      {/* HERO BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-4 py-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/60">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="text-[11px] font-sans font-bold text-primary tracking-wide uppercase">
            Plataforma 100% Funcional e Veloz
          </span>
        </div>

        <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-primary tracking-tight leading-none">
          O encurtador de links mais{' '}
          <span className="text-secondary italic underline decoration-wavy decoration-outline-variant/40">
            mineiro
          </span>{' '}
          da web!
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-on-surface-variant font-medium max-w-xl mx-auto leading-relaxed">
          Encurte seus links e suba suas fotos num piscar de olhos, sem complicação de trem difícil.
          Com links diretos prontinhos para incorporar em HTML!
        </p>
      </div>

      {/* TABS SELECTOR */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex bg-surface-container rounded-2xl p-1.5 border border-outline-variant/40 shrink-0">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'link'
                ? 'bg-primary text-surface shadow-xs'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Encurtar Link</span>
          </button>

          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'photo'
                ? 'bg-primary text-surface shadow-xs'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Hospedar Foto</span>
          </button>
        </div>

        <div className="relative">
          {activeTab === 'link' ? (
            <LinkShortener onShorten={handleShortenLink} />
          ) : (
            <PhotoUploader onUpload={handleUploadPhoto} isLoggedIn={!!currentUser} />
          )}
        </div>
      </div>

      {/* PUBLIC GALLERY */}
      <div className="pt-8 border-t border-surface-container-high">
        <PublicGallery
          photos={photos}
          onSelectPhoto={(photo) => {
            handleSelectPhoto(photo);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </motion.div>
  );
}
