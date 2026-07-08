import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Plus, BarChart3, ExternalLink, Copy, Check, Trash2,
} from 'lucide-react';
import { useLinks } from '../contexts/LinkContext';
import { useToast } from '../contexts/ToastContext';

export default function DashboardLinksPage() {
  const { t } = useTranslation();
  const {
    links,
    totalLinksPages,
    totalLinks,
    handleDeleteLink,
    triggerRedirect,
    handleOpenStatsModal,
    fetchUserLinks
  } = useLinks();
  const { handleCopyText, isCopiedId } = useToast();
  const navigate = useNavigate();

  const [linksPage, setLinksPage] = useState(1);
  const linksPerPage = 10;

  React.useEffect(() => {
    fetchUserLinks(linksPage - 1);
  }, [linksPage, fetchUserLinks]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const onTriggerRedirect = (link: Parameters<typeof triggerRedirect>[0]) => {
    triggerRedirect(link);
    navigate('/redirecting');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-black text-2xl text-primary">{t('dashboard.links.title')}</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {t('dashboard.links.subtitle')}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-surface font-semibold text-xs rounded-xl hover:bg-primary-container transition flex items-center space-x-1 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('dashboard.links.newLink')}</span>
        </button>
      </div>

      {links.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-outline-variant/60 italic text-on-surface-variant text-sm font-medium">
          {t('dashboard.links.emptyState')}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/40">
                  <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif">{t('dashboard.links.colDestination')}</th>
                  <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif">{t('dashboard.links.colCode')}</th>
                  <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif text-center">{t('dashboard.links.colClicks')}</th>
                  <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif text-center">{t('dashboard.links.colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {links.map((link) => (
                  <tr
                    key={link.id}
                    onClick={() => handleOpenStatsModal(link)}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <td className="p-4 max-w-[150px] sm:max-w-xs md:max-w-md">
                      <div className="truncate text-xs text-on-surface-variant font-mono" title={link.originalUrl}>
                        {link.originalUrl}
                      </div>
                      <span className="text-[9px] text-on-surface-variant/70 italic mt-0.5 block">
                        {t('dashboard.links.createdAt')} {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs font-extrabold text-secondary">
                      <div className="flex items-center space-x-1.5">
                        <span className="truncate">{link.shortUrl}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTriggerRedirect(link);
                          }}
                          className="p-1 text-primary hover:text-secondary hover:bg-surface-container rounded-md transition cursor-pointer shrink-0"
                          title={t('dashboard.links.simulateClicks')}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono text-xs font-bold text-primary">
                      <span className="inline-block px-2.5 py-1 bg-surface-container rounded-full border border-outline-variant/30">
                        {link.clicks}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenStatsModal(link); }}
                          className="p-1.5 bg-surface-container-high/60 border border-outline-variant/40 hover:bg-surface-container-high text-primary hover:text-secondary rounded-lg transition cursor-pointer"
                          title={t('dashboard.links.viewDetailedStats')}
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyText(link.shortUrl, link.id);
                          }}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${isCopiedId === link.id
                            ? 'bg-tertiary/10 text-tertiary border-tertiary-container'
                            : 'bg-surface-container-high/60 border-outline-variant/40 hover:bg-surface-container-high text-primary'
                            }`}
                          title={t('dashboard.links.copyLink')}
                        >
                          {isCopiedId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setDeletingIds((prev) => [...prev, link.id]);
                            await handleDeleteLink(link.id);
                            setDeletingIds((prev) => prev.filter(id => id !== link.id));
                          }}
                          disabled={deletingIds.includes(link.id)}
                          className="p-1.5 bg-error-container/10 border border-error-container/20 text-error hover:bg-error-container/20 rounded-lg transition cursor-pointer"
                          title={t('dashboard.links.removeLink')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-outline-variant/50 flex flex-col sm:flex-row justify-between items-center bg-surface-container-low gap-3">
            <span className="text-xs text-on-surface-variant font-medium">
              {t('dashboard.links.paginationShowing', {
                from: totalLinks === 0 ? 0 : (linksPage - 1) * linksPerPage + 1,
                to: Math.min(linksPage * linksPerPage, totalLinks),
                total: totalLinks
              })}
            </span>
            {totalLinksPages > 1 && (
              <div className="flex items-center space-x-1 flex-wrap gap-1">
                <button
                  disabled={linksPage === 1}
                  onClick={() => setLinksPage((p) => Math.max(1, p - 1))}
                  className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${linksPage === 1
                    ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                    }`}
                >
                  {t('dashboard.links.paginationPrev')}
                </button>
                {Array.from({ length: totalLinksPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLinksPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border ${linksPage === i + 1
                      ? 'bg-primary border-primary text-surface font-black'
                      : 'border-outline-variant hover:bg-surface-container-high/60 text-primary bg-white'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={linksPage === totalLinksPages}
                  onClick={() => setLinksPage((p) => Math.min(totalLinksPages, p + 1))}
                  className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${linksPage === totalLinksPages
                    ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                    }`}
                >
                  {t('dashboard.links.paginationNext')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
