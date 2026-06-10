import React from 'react';
import { X, Sparkles, TrendingUp, Laptop, Globe, Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LinkItem } from '../types';

interface LinkStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
}

// Deterministic generator so stats are stable per link but vary realistically
function getDeterministicStats(linkId: string, clicks: number) {
  let hash = 0;
  for (let i = 0; i < linkId.length; i++) {
    hash = linkId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Browser distribution
  const chromeBase = 50 + (hash % 15); // 50% - 64%
  const safariBase = 15 + ((hash >> 1) % 12); // 15% - 26%
  const firefoxBase = 8 + ((hash >> 2) % 8); // 8% - 15%
  const remainingBrowser = Math.max(0, 100 - chromeBase - safariBase - firefoxBase);

  // OS / Device distribution
  const mobileBase = 55 + (hash % 20); // 55% - 74%
  const windowsBase = 18 + ((hash >> 3) % 12); // 18% - 29%
  const macBase = Math.max(0, 100 - mobileBase - windowsBase);

  // Locations share
  const locations = [
    { name: '🇧🇷 Belo Horizonte, MG', share: 0.42 },
    { name: '🇧🇷 Ouro Preto, MG', share: 0.18 },
    { name: '🇧🇷 Uberlândia, MG', share: 0.14 },
    { name: '🇧🇷 Tiradentes, MG', share: 0.10 },
    { name: '🇧🇷 Montes Claros, MG', share: 0.08 },
    { name: '🇵🇹 Portugal', share: 0.05 },
    { name: '🇧🇷 Outros cantos', share: 0.03 }
  ];

  return {
    browsers: [
      { name: 'Google Chrome', percentage: chromeBase, color: '#EA4335' },
      { name: 'Safari', percentage: safariBase, color: '#00A2E8' },
      { name: 'Mozilla Firefox', percentage: firefoxBase, color: '#FF9500' },
      { name: 'Outros (UaiBrowser)', percentage: remainingBrowser, color: '#77574D' }
    ].filter(b => b.percentage > 0),
    devices: [
      { name: 'Mobile (Celular/Tablet)', percentage: mobileBase, icon: Smartphone, color: '#904D1E' },
      { name: 'Windows (Computador)', percentage: windowsBase, icon: Monitor, color: '#442A22' },
      { name: 'Mac OS & Outros', percentage: macBase, icon: Laptop, color: '#827470' }
    ].filter(d => d.percentage > 0),
    locations: locations.map(l => ({
      name: l.name,
      count: clicks === 0 ? 0 : Math.max(1, Math.round(clicks * l.share))
    }))
  };
}

export default function LinkStatsModal({ isOpen, onClose, link }: LinkStatsModalProps) {
  if (!link) return null;

  const stats = getDeterministicStats(link.id, link.clicks);

  // Formulate absolute URL for copy or visual
  const shortAbsoluteUrl = `${window.location.origin}/${link.shortUrl.split('/')[1]}`;

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
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-surface w-full max-w-2xl rounded-3xl border border-outline-variant shadow-lg flex flex-col max-h-[90vh] md:max-h-[85vh] z-10 overflow-hidden"
          >
            {/* Header / Top Banner */}
            <div className="bg-surface-container-low border-b border-outline-variant/60 p-5 pr-14 relative shrink-0">
              <span className="text-[10px] font-sans font-black text-secondary tracking-widest uppercase block mb-1">
                Relatório de Tráfego do Trilho 🚂
              </span>
              <h3 className="font-serif font-black text-lg md:text-xl text-primary leading-tight truncate">
                {link.shortUrl}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono truncate mt-1">
                Destino: {link.originalUrl}
              </p>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-xl transition-all cursor-pointer"
                title="Fechar Relatório"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Contents Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
              
              {/* Primary Stats Panel row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Metric 1: Clicks */}
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-on-surface-variant mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider">Cliqueis Totais</span>
                    <TrendingUp className="w-4 h-4 text-secondary shrink-0" />
                  </div>
                  <div>
                    <span className="text-3xl font-serif font-black text-primary block leading-none">
                      {link.clicks}
                    </span>
                    <span className="text-[10px] text-tertiary font-bold mt-1.5 inline-block bg-tertiary-container/10 px-2 py-0.5 rounded-full border border-tertiary-container/20">
                      +12% esta semana uai!
                    </span>
                  </div>
                </div>

                {/* Metric 2: Top Device */}
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-on-surface-variant mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider">Principal Canal</span>
                    <Smartphone className="w-4 h-4 text-secondary shrink-0" />
                  </div>
                  <div>
                    <span className="text-xl font-serif font-black text-primary block leading-tight">
                      {stats.devices[0]?.name.split(' ')[0] || 'Mobile'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/90 block mt-1 font-medium">
                      Tem {stats.devices[0]?.percentage}% de preferência!
                    </span>
                  </div>
                </div>

                {/* Metric 3: Top Location */}
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-on-surface-variant mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider">Estação Líder</span>
                    <Globe className="w-4 h-4 text-secondary shrink-0" />
                  </div>
                  <div>
                    <span className="text-sm font-serif font-black text-primary block leading-tight truncate">
                      {stats.locations[0]?.name.replace('🇧🇷 ', '') || 'Belo Horizonte'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/90 block mt-1 font-medium">
                      Com {stats.locations[0]?.count || 0} visitas diretas.
                    </span>
                  </div>
                </div>

              </div>

              {/* Multi-Column Data Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Left: Device/OS & Browser Bars */}
                <div className="space-y-5">
                  
                  {/* Browser distribution card */}
                  <div className="bg-surface-container-high rounded-2xl p-4 sm:p-5 border border-outline-variant/50 space-y-3.5">
                    <h4 className="font-serif font-black text-xs text-primary uppercase tracking-wide border-b border-surface-container pb-2 flex items-center gap-1.5">
                      <span>Navegadores Utilizados</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {stats.browsers.map((browser) => (
                        <div key={browser.name} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-primary">
                            <span>{browser.name}</span>
                            <span>{browser.percentage}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{
                                width: `${browser.percentage}%`,
                                backgroundColor: browser.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OS distribution card */}
                  <div className="bg-surface-container-high rounded-2xl p-4 sm:p-5 border border-outline-variant/50 space-y-3.5">
                    <h4 className="font-serif font-black text-xs text-primary uppercase tracking-wide border-b border-surface-container pb-2 flex items-center gap-1.5">
                      <span>Sistemas Operacionais & Canais</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {stats.devices.map((device) => {
                        const DeviceIcon = device.icon;
                        return (
                          <div key={device.name} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-primary items-center">
                              <span className="flex items-center gap-1.5">
                                <DeviceIcon className="w-3.5 h-3.5 opacity-80" />
                                <span>{device.name}</span>
                              </span>
                              <span>{device.percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                  width: `${device.percentage}%`,
                                  backgroundColor: device.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right: Geographical list */}
                <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-black text-xs text-primary uppercase tracking-wide border-b border-outline-variant/30 pb-2 flex items-center justify-between mb-3">
                      <span>De onde vem o povo (Origem)</span>
                      <span className="text-[10px] text-on-surface-variant font-mono font-medium">Uai-Analytics</span>
                    </h4>

                    {link.clicks === 0 ? (
                      <div className="py-8 text-center text-xs text-on-surface-variant italic font-medium">
                        Ninguém pegou esse trem ainda. Os dados vão aparecer quando tiver cliques!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[196px] overflow-y-auto pr-1">
                        {stats.locations.map((loc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface hover:bg-surface-container-high transition border border-outline-variant/20"
                          >
                            <span className="text-xs font-bold text-primary font-sans">{loc.name}</span>
                            <span className="text-[10px] font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/30">
                              {loc.count} cliques
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-surface-container/40 p-2.5 rounded-xl border border-outline-variant/30 mt-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                    <p className="text-[9px] text-on-surface-variant leading-tight">
                      A maioria dos passageiros é de Minas, uai! Seus trilhos estão bem movimentados.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer containing close controls */}
            <div className="bg-surface-container-low border-t border-outline-variant/60 p-4 shrink-0 flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant/80 italic font-medium sm:block hidden">
                Criado em: {new Date(link.createdAt).toLocaleDateString('pt-BR')}
              </span>
              
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-secondary text-white font-serif font-black text-xs rounded-xl hover:bg-secondary/90 transition-all cursor-pointer shadow-xs ml-auto"
              >
                Fechar Painel
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
