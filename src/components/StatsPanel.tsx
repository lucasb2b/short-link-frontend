import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Link2, ImageIcon, Database, Globe, Layers, Laptop, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MAP_URL } from '../data';
import { getUserStatsAPI } from '../services/api';

interface StatsResponse {
  totalLinks: number;
  totalClicks: number;
  totalPhotos: number;
  trafficSavedBytes: number;
  topCountries: Record<string, number>;
  topBrowsers: Record<string, number>;
  topOS: Record<string, number>;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const mapToPercentages = (data: Record<string, number>, total: number) => {
  return Object.entries(data).map(([name, count], index) => {
    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
    const colors = ['#2b4c7e', '#567c8d', '#f4e0c4', '#f1c998', '#d7894d'];
    return { name, percentage, color: colors[index % colors.length], count };
  }).sort((a, b) => b.count - a.count);
};

export default function StatsPanel() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    getUserStatsAPI().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-primary font-bold">Carregando métricas da estação...</p>
      </div>
    );
  }

  const browsersArray = mapToPercentages(stats.topBrowsers, stats.totalClicks);
  const osArray = mapToPercentages(stats.topOS, stats.totalClicks);
  const countriesArray = mapToPercentages(stats.topCountries, stats.totalClicks);
  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div>
        <h3 className="font-serif font-black text-2xl text-primary flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-secondary" />
          <span>Estatísticas de Tráfego do Trem</span>
        </h3>
        <p className="text-sm text-on-surface-variant font-medium mt-1">
          Acompanhe os números da estação, cliques nos links e visualizações das fotos em tempo real.
        </p>
      </div>

      {/* Grid Cards of Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Cliques Totais',
            value: stats.totalClicks.toLocaleString(),
            change: 'Registrados nos links',
            icon: TrendingUp,
            color: 'bg-primary/10 text-primary border-primary/20',
          },
          {
            title: 'Links Encurtados',
            value: stats.totalLinks.toLocaleString(),
            change: 'Gerados na conta',
            icon: Link2,
            color: 'bg-secondary/10 text-secondary border-secondary/20',
          },
          {
            title: 'Fotos Hospedadas',
            value: stats.totalPhotos.toLocaleString(),
            change: 'Imagens ativas',
            icon: ImageIcon,
            color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
          },
          {
            title: 'Tráfego Economizado',
            value: formatBytes(stats.trafficSavedBytes),
            change: 'Economia total de banda',
            icon: Database,
            color: 'bg-primary/10 text-primary border-primary/20',
          },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-outline-variant/60 flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                  {item.title}
                </span>
                <span className="text-2xl font-serif font-black text-primary block leading-none">
                  {item.value}
                </span>
                <span className="text-[10px] text-secondary font-bold block bg-surface-container px-2 py-0.5 rounded-full w-max border border-outline-variant/30">
                  {item.change}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Browser & OS donut stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Navegadores */}
          <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 space-y-4">
            <h4 className="font-serif font-extrabold text-sm text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-surface-container pb-3">
              <Layers className="w-4 h-4 text-secondary" />
              Navegadores Utilizados
            </h4>
            <div className="space-y-4">
              {browsersArray.length > 0 ? browsersArray.map((b) => (
                <div key={b.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>{b.name}</span>
                    <span>{b.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${b.percentage}%`,
                        backgroundColor: b.color,
                      }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-xs text-on-surface-variant italic">Sem dados de navegadores.</p>
              )}
            </div>
          </div>

          {/* Sistema Operacional */}
          <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 space-y-4">
            <h4 className="font-serif font-extrabold text-sm text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-surface-container pb-3">
              <Laptop className="w-4 h-4 text-secondary" />
              Sistemas Operacionais
            </h4>
            <div className="space-y-4">
              {osArray.length > 0 ? osArray.map((os) => (
                <div key={os.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>{os.name}</span>
                    <span>{os.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${os.percentage}%`,
                        backgroundColor: os.color,
                      }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-xs text-on-surface-variant italic">Sem dados de sistema operacional.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Map and Country list */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white p-5 rounded-2xl border border-outline-variant/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
            <h4 className="font-serif font-extrabold text-sm text-primary uppercase tracking-wide flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-secondary" />
              De onde vem o povo (Origem de Acessos)
            </h4>
            <span className="text-[10px] text-on-surface-variant font-mono font-medium">
              Dados atualizados há 10 minutinhos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center flex-1">
            {/* Map representation with image link from prompt */}
            <div className="sm:col-span-7 flex items-center justify-center bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/50 relative p-1 max-h-[220px]">
              <img
                src={MAP_URL}
                alt="Mapa Demográfico de Minas"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-primary/90 text-surface p-1.5 rounded-lg text-[9px] font-mono leading-none border border-outline-variant/30">
                Uai-analytics Ativo
              </div>
            </div>

            {/* Country analytics table list */}
            <div className="sm:col-span-5 space-y-3.5">
              {countriesArray.length > 0 ? countriesArray.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-xl bg-surface hover:bg-surface-container-low transition duration-150 border border-outline-variant/20"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl leading-none">📍</span>
                    <span className="text-xs font-bold text-primary">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/30">
                    {item.count.toLocaleString()} cliques
                  </span>
                </div>
              )) : (
                <p className="text-xs text-on-surface-variant italic p-2">Nenhum dado geográfico registrado ainda.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
