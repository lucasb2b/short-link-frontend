import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, Tag, User, Clock, AlertTriangle, Loader2, HardDrive } from 'lucide-react';
import { getImageDetailsAPI } from '../services/api';

interface ImageDetails {
  originalFilename: string;
  shortCode: string;
  shortUrl: string;
  storageUrl: string;
  tags: string[];
  expiresAt: string | null;
  isAnonymous: boolean;
  createdAt?: string;
  size?: number;
}

function getRemainingTime(expiresAt: string) {
  const total = Date.parse(expiresAt) - Date.now();
  if (total <= 0) return null;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function ImageViewPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    if (!imageDetails?.expiresAt) return;
    
    const updateTimer = () => {
      setTimeLeft(getRemainingTime(imageDetails.expiresAt!));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [imageDetails]);

  useEffect(() => {
    if (shortCode) {
      getImageDetailsAPI(shortCode)
        .then((data) => {
          setImageDetails(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || 'Imagem não encontrada.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shortCode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-primary font-bold">Buscando o retrato...</p>
      </div>
    );
  }

  if (error || !imageDetails) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-12 bg-error-container/20 border border-error-container p-8 rounded-3xl text-center space-y-4"
      >
        <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-black text-error">Uai, deu ruim!</h2>
        <p className="text-on-surface-variant font-medium pb-4">{error}</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs"
        >
          Voltar para a Estação
        </Link>
      </motion.div>
    );
  }

  const { storageUrl, originalFilename, isAnonymous, tags, expiresAt, createdAt, size } = imageDetails;

  const formattedSize = size ? `${(size / (1024 * 1024)).toFixed(2)} MB` : null;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('pt-BR') : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="bg-white rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Image Viewer */}
        <div className="w-full md:w-2/3 bg-surface-container flex items-center justify-center relative min-h-[300px] border-b md:border-b-0 md:border-r border-outline-variant/30 p-4">
          <img 
            src={storageUrl} 
            alt={originalFilename} 
            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-xs"
          />
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/3 p-6 flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif font-black text-xl text-primary break-words">
              {originalFilename}
            </h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30 w-fit">
                <User className="w-4 h-4 text-secondary" />
                <span className="font-bold">
                  {isAnonymous ? 'Enviado por: Usuário Não Identificado' : 'Usuário Autenticado da Plataforma'}
                </span>
              </div>
              
              {(formattedDate || formattedSize) && (
                <div className="flex items-center gap-4 text-[11px] font-mono font-bold text-on-surface-variant">
                  {formattedDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      Upload: {formattedDate}
                    </span>
                  )}
                  {formattedSize && (
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-primary" />
                      Tamanho: {formattedSize}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-primary uppercase tracking-wide flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Marcadores
            </h3>
            {tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant italic">Nenhuma tag cadastrada.</p>
            )}
          </div>

          {expiresAt && (
            <div className="space-y-2 p-3 bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl">
              <h3 className="text-xs font-extrabold text-tertiary uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Vencimento do Trem
              </h3>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-2">
                Essa imagem é temporária e será apagada do servidor na data limite.
              </p>
              
              {timeLeft ? (
                <div className="flex gap-2">
                  <div className="flex flex-col items-center bg-tertiary-container text-on-tertiary-container p-2 rounded-lg min-w-[50px] shadow-sm">
                    <span className="font-mono font-black text-lg">{timeLeft.days}</span>
                    <span className="text-[9px] font-bold uppercase">Dias</span>
                  </div>
                  <div className="flex flex-col items-center bg-tertiary-container text-on-tertiary-container p-2 rounded-lg min-w-[50px] shadow-sm">
                    <span className="font-mono font-black text-lg">{timeLeft.hours}</span>
                    <span className="text-[9px] font-bold uppercase">Horas</span>
                  </div>
                  <div className="flex flex-col items-center bg-tertiary-container text-on-tertiary-container p-2 rounded-lg min-w-[50px] shadow-sm">
                    <span className="font-mono font-black text-lg">{timeLeft.minutes}</span>
                    <span className="text-[9px] font-bold uppercase">Min</span>
                  </div>
                  <div className="flex flex-col items-center bg-error-container text-on-error-container p-2 rounded-lg min-w-[50px] shadow-sm animate-pulse">
                    <span className="font-mono font-black text-lg">{timeLeft.seconds}</span>
                    <span className="text-[9px] font-bold uppercase">Seg</span>
                  </div>
                </div>
              ) : (
                <p className="text-error font-bold text-sm">Tempo esgotado! A imagem foi removida.</p>
              )}
            </div>
          )}

          <div className="flex-grow flex flex-col justify-end pt-4 border-t border-outline-variant/30">
             <a
              href={storageUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Baixar Retrato</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/" className="text-sm font-bold text-secondary hover:underline">
          &larr; Voltar para a Galeria e Encurtador
        </Link>
      </div>
    </motion.div>
  );
}
