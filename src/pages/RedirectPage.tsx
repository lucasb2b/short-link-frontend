import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLinks } from '../contexts/LinkContext';
import RedirectScreen from '../components/RedirectScreen';
import { getLinkInfoAPI } from '../services/api';
import { LinkItem } from '../types';

export default function RedirectPage() {
  const { redirectingLink, fetchUserLinks } = useLinks();
  const navigate = useNavigate();
  const { shortCode } = useParams<{ shortCode?: string }>(); // 👈 captura o parâmetro da URL

  const [fetchedLink, setFetchedLink] = useState<LinkItem | null>(null);
  const [error, setError] = useState(false);

  // Se já existe link vindo do contexto, use-o. Senão, busque via API.
  useEffect(() => {
    if (redirectingLink) return; // já tem link do dashboard

    if (!shortCode) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      try {
        const data = await getLinkInfoAPI(shortCode);
        setFetchedLink({
          id: data.shortCode,
          originalUrl: data.originalUrl,
          shortUrl: data.shortUrl,
          clicks: 0,
          createdAt: new Date().toISOString(),
          trend: 'stable',
        });
      } catch (err) {
        setError(true);
      }
    })();
  }, [redirectingLink, shortCode, navigate]);

  // Escolhe qual link usar
  const link = redirectingLink || fetchedLink;

  if (!link && !error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-on-surface-variant text-sm font-medium">Carregando o trem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        key="error-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4"
      >
        <h2 className="font-serif font-black text-2xl text-primary">Link não encontrado 🚫</h2>
        <p className="text-sm text-on-surface-variant">
          Esse trem não está mais na estação, sô!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-surface font-bold rounded-xl hover:bg-primary-container transition"
        >
          Voltar para a Estação
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="redirecting-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <RedirectScreen
        link={link!}
        onCancel={() => navigate('/')}
      />
    </motion.div>
  );
}