import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, Tag, HardDrive, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { PhotoItem } from '../types';

interface PhotoDetailProps {
  photo: PhotoItem;
  onBack: () => void;
}

export default function PhotoDetail({ photo, onBack }: PhotoDetailProps) {
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back navigation button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white text-primary font-bold border border-outline-variant/60 rounded-xl hover:bg-surface-container-low transition cursor-pointer text-sm shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar pros Retratos</span>
        </button>
      </div>

      {/* Main Grid: Photo Box & Data Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-xs">
        
        {/* Photo Box */}
        <div className="lg:col-span-7 bg-surface-container-low flex flex-col justify-center items-center border-r border-outline-variant/30 min-h-[300px] lg:min-h-[450px] p-4 relative">
          <img
            src={photo.imageUrl}
            alt={photo.fileName}
            className="rounded-2xl max-h-[450px] w-auto max-w-full object-contain shadow-md border border-outline-variant/40"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Info panel */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-serif font-black text-2xl text-primary leading-tight break-all">
                {photo.fileName}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono mt-1 font-bold">Consumo de espaço: {photo.size}</p>
            </div>

            <hr className="border-surface-container" />

            {/* Metadata Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-secondary" />
                  Autor do Retrato
                </span>
                <span className="text-xs font-serif font-extrabold text-primary truncate max-w-full block">
                  {photo.author}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-secondary" />
                  Hospedado em
                </span>
                <span className="text-xs font-mono font-bold text-primary">
                  {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Tags section */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-secondary" />
                Marcadores
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

            <hr className="border-surface-container" />

            {/* DIRECT HTML LINKS (Requested feature) */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Compartilhamento & Links Diretos
                </h4>
                {photo.isPrivate && (
                  <span className="text-[9px] font-bold text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                    🔒 Link Privado / Não listado
                  </span>
                )}
              </div>

              {/* 1. Share link to Photo Page (Works for Private, hides on search) */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-primary uppercase">Link de Compartilhamento (Página do Retrato)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?photo=${photo.id.replace('photo-', '')}`}
                    className="flex-1 px-3 py-2 bg-surface rounded-xl border border-primary/40 text-[11px] font-mono select-all truncate text-primary font-bold"
                  />
                  <button
                    onClick={() => handleCopy(`${window.location.origin}/?photo=${photo.id.replace('photo-', '')}`, setCopiedShare)}
                    className="p-2 bg-primary hover:bg-primary-container border border-outline-variant/60 rounded-xl transition text-white cursor-pointer active:scale-95 shrink-0"
                    title="Copiar Link de Compartilhamento"
                  >
                    {copiedShare ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>

              {/* Direct image url */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Link Direto da Foto (Ideal para baixar)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={photo.imageUrl}
                    className="flex-1 px-3 py-2 bg-surface rounded-xl border border-outline-variant text-[11px] font-mono select-all truncate text-primary font-semibold"
                  />
                  <button
                    onClick={() => handleCopy(photo.imageUrl, setCopiedLink)}
                    className="p-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 rounded-xl transition text-primary cursor-pointer active:scale-95 shrink-0"
                    title="Copiar Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Image markup to copy in html links */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Incorporar no HTML (&lt;img /&gt;)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={htmlCode}
                    className="flex-1 px-3 py-2 bg-surface rounded-xl border border-outline-variant text-[11px] font-mono select-all truncate text-primary font-semibold"
                  />
                  <button
                    onClick={() => handleCopy(htmlCode, setCopiedHtml)}
                    className="p-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 rounded-xl transition text-primary cursor-pointer active:scale-95 shrink-0"
                    title="Copiar HTML"
                  >
                    {copiedHtml ? <Check className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Markdown code links */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Código em Markdown</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={markdownCode}
                    className="flex-1 px-3 py-2 bg-surface rounded-xl border border-outline-variant text-[11px] font-mono select-all truncate text-primary font-semibold"
                  />
                  <button
                    onClick={() => handleCopy(markdownCode, setCopiedMd)}
                    className="p-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 rounded-xl transition text-primary cursor-pointer active:scale-95 shrink-0"
                    title="Copiar Markdown"
                  >
                    {copiedMd ? <Check className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-surface-container flex gap-2">
            <button
              onClick={downloadImage}
              className="flex-1 px-4 py-2.5 bg-primary text-surface font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container transition shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Retrato</span>
            </button>
            <a
              href={photo.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-surface border border-outline-variant text-primary font-bold rounded-xl text-xs sm:text-sm hover:bg-surface-container-low transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Fora</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
