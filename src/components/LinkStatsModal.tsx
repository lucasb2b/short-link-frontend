import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Laptop, Globe, Smartphone, Monitor, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LinkItem, AnalyticsResponseDTO } from '../types';
import { getLinkAnalyticsAPI } from '../services/api';

interface LinkStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
}

const BROWSER_COLORS: Record<string, string> = {
  'Chrome': '#EA4335',
  'Safari': '#00A2E8',
  'Firefox': '#FF9500',
  'Edge': '#0078D7',
  'Outros': '#77574D'
};

function formatData(data: AnalyticsResponseDTO) {
  const formatPercentage = (val: number, total: number) => total > 0 ? Math.round((val / total) * 100) : 0;

  const totalBrowsers = Object.values(data.browsers || {}).reduce((acc, val) => acc + val, 0);
  const browsers = Object.entries(data.browsers || {}).map(([name, count]) => {
    let color = BROWSER_COLORS['Outros'];
    for (const key of Object.keys(BROWSER_COLORS)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        color = BROWSER_COLORS[key];
        break;
      }
    }
    return {
      name,
      percentage: formatPercentage(count, totalBrowsers),
      color
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const totalDevices = Object.values(data.deviceTypes || {}).reduce((acc, val) => acc + val, 0);
  const devices = Object.entries(data.deviceTypes || {}).map(([name, count]) => {
    let icon = Monitor;
    let color = '#442A22';
    if (name.toLowerCase().includes('mobile') || name.toLowerCase().includes('phone') || name.toLowerCase().includes('android') || name.toLowerCase().includes('ios')) {
      icon = Smartphone;
      color = '#904D1E';
    } else if (name.toLowerCase().includes('mac')) {
      icon = Laptop;
      color = '#827470';
    }
    return {
      name,
      percentage: formatPercentage(count, totalDevices),
      icon,
      color
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const locations = Object.entries(data.countries || {}).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  return {
    browsers,
    devices,
    locations,
    totalClicks: data.totalClicks || 0,
  };
}

export default function LinkStatsModal({ isOpen, onClose, link }: LinkStatsModalProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && link) {
      setLoading(true);
      setError(null);
      getLinkAnalyticsAPI(link.id)
        .then(res => setData(res))
        .catch(err => setError(err.message || t('linkStatsModal.error')))
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [isOpen, link, t]);

  if (!link) return null;

  const stats = data ? formatData(data) : { browsers: [], devices: [], locations: [], totalClicks: 0 };
  const clicksToDisplay = Math.max(link.clicks, stats.totalClicks);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/45 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-surface w-full max-w-2xl rounded-3xl border border-outline-variant shadow-lg flex flex-col max-h-[90vh] md:max-h-[85vh] z-10 overflow-hidden"
          >
            <div className="bg-surface-container-low border-b border-outline-variant/60 p-5 pr-14 relative shrink-0">
              <span className="text-[10px] font-sans font-black text-secondary tracking-widest uppercase block mb-1">
                {t('linkStatsModal.title')}
              </span>
              <h3 className="font-serif font-black text-lg md:text-xl text-primary leading-tight truncate">
                {link.shortUrl}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono truncate mt-1">
                {t('linkStatsModal.destination')} {link.originalUrl}
              </p>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-xl transition-all cursor-pointer"
                title={t('linkStatsModal.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-on-surface-variant font-medium text-sm">{t('linkStatsModal.loading')}</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <ShieldAlert className="w-10 h-10 text-error mb-4" />
                  <p className="text-error font-bold text-sm text-center">{error}</p>
                  <button onClick={onClose} className="mt-4 px-4 py-2 bg-surface-container rounded-lg text-primary text-xs font-bold hover:bg-surface-container-high transition">{t('linkStatsModal.retry')}</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-on-surface-variant mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider">{t('linkStatsModal.totalClicks')}</span>
                        <TrendingUp className="w-4 h-4 text-secondary shrink-0" />
                      </div>
                      <div>
                        <span className="text-3xl font-serif font-black text-primary block leading-none">
                          {clicksToDisplay}
                        </span>
                        <span className="text-[10px] text-tertiary font-bold mt-1.5 inline-block bg-tertiary-container/10 px-2 py-0.5 rounded-full border border-tertiary-container/20">
                          {t('linkStatsModal.realTime')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-on-surface-variant mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider">{t('linkStatsModal.topChannel')}</span>
                        <Smartphone className="w-4 h-4 text-secondary shrink-0" />
                      </div>
                      <div>
                        <span className="text-xl font-serif font-black text-primary block leading-tight">
                          {stats.devices[0]?.name.split(' ')[0] || 'N/A'}
                        </span>
                        {stats.devices[0] && (
                          <span className="text-[11px] text-on-surface-variant/90 block mt-1 font-medium">
                            {t('linkStatsModal.preference', { pct: stats.devices[0]?.percentage })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-on-surface-variant mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider">{t('linkStatsModal.topLocation')}</span>
                        <Globe className="w-4 h-4 text-secondary shrink-0" />
                      </div>
                      <div>
                        <span className="text-sm font-serif font-black text-primary block leading-tight truncate">
                          {stats.locations[0]?.name.replace('🇧🇷 ', '') || 'N/A'}
                        </span>
                        {stats.locations[0] && (
                          <span className="text-[11px] text-on-surface-variant/90 block mt-1 font-medium">
                            {t('linkStatsModal.visitsFrom', { count: stats.locations[0]?.count || 0 })}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="space-y-5">

                      <div className="bg-surface-container-high rounded-2xl p-4 sm:p-5 border border-outline-variant/50 space-y-3.5">
                        <h4 className="font-serif font-black text-xs text-primary uppercase tracking-wide border-b border-surface-container pb-2 flex items-center gap-1.5">
                          <span>{t('linkStatsModal.browsers')}</span>
                        </h4>

                        <div className="space-y-3">
                          {stats.browsers.length > 0 ? stats.browsers.map((browser) => (
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
                          )) : (
                            <p className="text-xs text-on-surface-variant italic">{t('linkStatsModal.noData')}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-surface-container-high rounded-2xl p-4 sm:p-5 border border-outline-variant/50 space-y-3.5">
                        <h4 className="font-serif font-black text-xs text-primary uppercase tracking-wide border-b border-surface-container pb-2 flex items-center gap-1.5">
                          <span>{t('linkStatsModal.osAndChannels')}</span>
                        </h4>

                        <div className="space-y-3">
                          {stats.devices.length > 0 ? stats.devices.map((device) => {
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
                          }) : (
                            <p className="text-xs text-on-surface-variant italic">{t('linkStatsModal.noData')}</p>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/50 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-black text-xs text-primary uppercase tracking-wide border-b border-outline-variant/30 pb-2 flex items-center justify-between mb-3">
                          <span>{t('linkStatsModal.origin')}</span>
                          <span className="text-[10px] text-on-surface-variant font-mono font-medium">{t('linkStatsModal.analytics')}</span>
                        </h4>

                        {clicksToDisplay === 0 || stats.locations.length === 0 ? (
                          <div className="py-8 text-center text-xs text-on-surface-variant italic font-medium">
                            {t('linkStatsModal.noClicks')}
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
                                  {loc.count} {t('stats.clicksLabel')}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-surface-container/40 p-2.5 rounded-xl border border-outline-variant/30 mt-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                        <p className="text-[9px] text-on-surface-variant leading-tight">
                          {t('linkStatsModal.footerHint')}
                        </p>
                      </div>
                    </div>

                  </div>
                </>
              )}

            </div>

            <div className="bg-surface-container-low border-t border-outline-variant/60 p-4 shrink-0 flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant/80 italic font-medium sm:block hidden">
                {t('linkStatsModal.createdAt')} {new Date(link.createdAt).toLocaleDateString('pt-BR')}
              </span>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-secondary text-white font-serif font-black text-xs rounded-xl hover:bg-secondary/90 transition-all cursor-pointer shadow-xs ml-auto"
              >
                {t('linkStatsModal.closePanel')}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}