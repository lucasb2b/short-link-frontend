import React, { useState } from 'react';
import { X, User, Calendar, Tag, Copy, Check, ExternalLink, Download, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PhotoItem } from '../types';

interface PhotoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: PhotoItem | null;
}

export default function PhotoDetailModal({ isOpen, onClose, photo }: PhotoDetailModalProps) {
  const { t, i18n } = useTranslation();

  if (!photo) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const htmlCode = `<img src="${photo.imageUrl}" alt="${photo.fileName}" />`;
  const markdownCode = `![${photo.fileName}](${photo.imageUrl})`;

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = photo.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          {/* Animated Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/45 backdrop-blur-md cursor-pointer"
            id="photo-modal-backdrop"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-surface w-full max-w-5xl rounded-3xl border border-outline-variant shadow-lg flex flex-col max-h-[92vh] md:max-h-[88vh] z-10 overflow-hidden"
            id="photo-modal-content"
          >
            {/* Close Button absolute inside container */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/65 backdrop-blur-xs text-white rounded-full transition cursor-pointer active:scale-95"
              id="photo-modal-close-btn"
              title={t('photoDetail.closeDetails')}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1 h-full custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 h-full">

                {/* Left Side: Large Photo Container */}
                <div className="lg:col-span-7 bg-surface-container-low flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-outline-variant/30 min-h-[280px] sm:min-h-[350px] lg:min-h-[500px] p-6 relative">
                  {/* Floating badgelines */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 pointer-events-none">
                    <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm text-white flex items-center gap-1 uppercase tracking-wider ${photo.isPrivate ? 'bg-error/85' : 'bg-tertiary/85'
                      }`}>
                      {photo.isPrivate ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>{t('photoDetail.privateBadge')}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3" />
                          <span>{t('photoDetail.publicBadge')}</span>
                        </>
                      )}
                    </span>
                    <span className="bg-black/60 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs">
                      {photo.size}
                    </span>
                  </div>

                  {/* Simulated memory warning for development safety */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.fileName}
                    className="rounded-2xl max-h-[260px] sm:max-h-[340px] lg:max-h-[480px] w-auto max-w-full object-contain shadow-md border border-outline-variant/40 hover:scale-[1.01] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right Side: Information Pane */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-sans font-black text-secondary tracking-widest uppercase block mb-1">
                        {t('photoDetail.modalInfoTitle')}
                      </span>
                      <h3 className="font-serif font-black text-xl sm:text-2xl text-primary leading-tight break-all">
                        {photo.fileName}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-mono mt-1 font-bold">
                        {t('photoDetail.spaceUsed')}: {photo.size}
                      </p>
                    </div>

                    <hr className="border-surface-container" />

                    {/* Metadata block */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3 text-secondary" />
                          {t('photoDetail.authorLabel')}
                        </span>
                        <span className="text-xs font-serif font-extrabold text-primary truncate max-w-full block">
                          {photo.author}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-secondary" />
                          {t('photoDetail.hostedOn')}
                        </span>
                        <span className="text-xs font-mono font-bold text-primary">
                          {new Date(photo.createdAt).toLocaleDateString(locale)}
                        </span>
                      </div>
                    </div>

                    {/* Tags section */}
                    {photo.tags && photo.tags.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1">
                          <Tag className="w-3 h-3 text-secondary" />
                          {t('photoDetail.tagsLabel')}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {photo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono font-bold bg-surface-container-high text-primary px-2 py-0.5 rounded-lg border border-outline-variant/40"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <hr className="border-surface-container" />

                    {/* Link Copier sections */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                          {t('photoDetail.shareTitle')}
                        </h4>
                      </div>

                      {/* 1. Share link to Photo Page (Works for Private, hides on search) */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-primary uppercase">
                          {t('photoDetail.shareLinkLabel')}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/i/${photo.id.replace('photo-', '')}`}
                            className="flex-1 px-3 py-2 bg-surface rounded-xl border border-primary/40 text-[11px] font-mono select-all truncate text-primary font-bold"
                          />
                          <button
                            onClick={() => handleCopy(`${window.location.origin}/i/${photo.id.replace('photo-', '')}`, setCopiedShare)}
                            className="p-2 bg-primary hover:bg-primary-container border border-outline-variant/60 rounded-xl transition text-white cursor-pointer active:scale-95 shrink-0"
                            title={t('photoDetail.copyShareLink')}
                          >
                            {copiedShare ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-surface-container flex gap-2">
                    <button
                      onClick={downloadImage}
                      className="flex-grow px-4 py-2.5 bg-primary text-surface font-black rounded-xl text-xs sm:text-sm hover:bg-primary-container transition shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('photoDetail.downloadPhoto')}</span>
                    </button>
                    <a
                      href={photo.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-surface border border-outline-variant text-primary font-bold rounded-xl text-xs sm:text-sm hover:bg-surface-container-low transition cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('photoDetail.openExternal')}</span>
                    </a>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}