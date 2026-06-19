import React, { useState } from 'react';
import { Link2, ArrowRight, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LinkItem } from '../types';
import { useApp } from '../context/AppContext';

interface LinkShortenerProps {
  onShorten: (originalUrl: string) => Promise<LinkItem>;
}

export default function LinkShortener({ onShorten }: LinkShortenerProps) {
  const { currentUser } = useApp();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LinkItem | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!currentUser) {
      setError('Você precisa estar logado para encurtar links, sô! Faça o login na estação.');
      return;
    }

    if (!url.trim()) {
      setError('Uai, digite o link para encurtar primeiro!');
      return;
    }

    // Basic URL validation
    let isValidUrl = false;
    try {
      new URL(url);
      isValidUrl = true;
    } catch (_) {
      // Try again with http if user skipped
      if (url.includes('.') && !url.startsWith('http')) {
        setUrl('https://' + url);
        isValidUrl = true;
      }
    }

    if (!isValidUrl) {
      setError('Eita, esse trem aí não parece um link válido não, sô! Confere ele.');
      return;
    }

    setLoading(true);
    try {
      // Pass the cleaned URL
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const shortened = await onShorten(targetUrl);
      setResult(shortened);
      setUrl('');
    } catch (err: any) {
      setError('Deu um tropeço ao tentar encurtar o trem, tente de novo!');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const fullShortUrl = result.shortUrl;
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3050);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden">
      {/* Decorative background lines or subtle shape */}
      <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-12">
        <Link2 className="w-64 h-64 text-primary" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-extrabold text-xl text-primary">Encurtador de Links</h3>
            <p className="text-xs text-on-surface-variant font-medium">Faça seu link comprido caber no bolso</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole seu link compridão aqui (ex: https://exemplo.com/pagina-gigante)"
              className="w-full px-4 py-3.5 pr-12 rounded-xl bg-surface border border-outline-variant/80 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm md:text-base font-sans"
              disabled={loading}
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-error text-xs font-semibold bg-error-container/20 px-3.5 py-2 rounded-lg border border-error-container"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto ml-auto px-6 py-3.5 bg-primary text-surface font-bold rounded-xl hover:bg-primary-container transition active:scale-95 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-sm md:text-base"
            >
              <span>{loading ? 'Trabalhando...' : 'Encurtar Trem'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>

        {/* Dynamic Result Area */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mt-6 pt-6 border-t border-outline-variant/40 space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Prontinho, sô! Copie seu trem:
              </h4>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-surface rounded-xl border border-outline-variant flex items-center justify-between font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap select-all text-primary font-semibold">
                  <span className="truncate">{`${window.location.origin}/${result.shortUrl.split('/')[1]}`}</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition flex items-center justify-center space-x-2 ${copied
                    ? 'bg-tertiary text-surface hover:bg-tertiary-container'
                    : 'bg-secondary text-surface hover:bg-secondary-container'
                    }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Trem!</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant italic">
                Link original apontado para:{' '}
                <span className="font-mono text-[10px] break-all block sm:inline">{result.originalUrl}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
