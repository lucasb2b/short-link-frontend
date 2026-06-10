import React, { useState, useEffect } from 'react';
import { Train, ExternalLink, RefreshCw, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { LinkItem } from '../types';

interface RedirectScreenProps {
  link: LinkItem;
  onCancel: () => void;
}

export default function RedirectScreen({ link, onCancel }: RedirectScreenProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      // Emulate redirecting by opening in new tab or updating state
      window.open(link.originalUrl, '_blank', 'noopener,noreferrer');
      onCancel(); // return home
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, link, onCancel]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto text-center space-y-8">
      
      {/* Train station icon anim */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary shadow-md relative z-10"
        >
          <Train className="w-12 h-12" />
        </motion.div>
        {/* Steam rings */}
        <motion.div
          initial={{ opacity: 0.5, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, y: -40, scale: 1.4 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-primary/40 bg-primary/10 pointer-events-none"
        />
      </div>

      {/* Countdown display */}
      <div className="space-y-3">
        <h2 className="font-serif font-black text-3xl text-primary">
          Embarcando no Trem!
        </h2>
        <p className="text-sm text-on-surface-variant font-medium max-w-sm mx-auto">
          Arreda o pé que a locomotiva tá saindo. Você será direcionado para o destino em:
        </p>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary text-surface text-2xl font-mono font-bold border border-outline-variant select-none shadow-md">
          {countdown}
        </div>
      </div>

      {/* Origin -> Destination flow visualcard */}
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 w-full text-left space-y-4 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Partida (Short)</span>
          <span className="text-sm font-mono text-primary font-bold">{link.shortUrl}</span>
        </div>

        <div className="relative flex items-center justify-center my-1">
          <div className="absolute left-0 right-0 h-[1.5px] bg-dashed border-t border-outline-variant/60" />
          <span className="relative z-10 px-3 bg-white text-[10px] font-bold text-secondary font-sans uppercase">
            Trajeto Direto
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Estação de destino</span>
          <span className="text-sm font-mono text-secondary font-bold break-all block">{link.originalUrl}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container-low transition cursor-pointer"
        >
          Voltar pra Estação
        </button>
        <a
          href={link.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCancel}
          className="flex-1 px-5 py-3 bg-primary text-surface font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container transition shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <span>Pular Catraca (Ir Agora)</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="text-[10px] text-on-surface-variant/70 italic flex items-center justify-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-secondary" />
        <span>Visita registrada sob o protocolo de segurança número {Math.floor(100000 + Math.random() * 900000)}</span>
      </div>

    </div>
  );
}
