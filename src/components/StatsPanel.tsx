import React from 'react';
import { BarChart3, TrendingUp, Link2, ImageIcon, Database, Globe, Layers, Laptop } from 'lucide-react';
import { motion } from 'motion/react';
import { BROWSER_STATS, OS_STATS, COUNTRY_STATS, MAP_URL } from '../data';

export default function StatsPanel() {
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
            value: '13.458',
            change: '+15.4% de ontem',
            icon: TrendingUp,
            color: 'bg-primary/10 text-primary border-primary/20',
          },
          {
            title: 'Links Encurtados',
            value: '228',
            change: '+8 gerados hoje',
            icon: Link2,
            color: 'bg-secondary/10 text-secondary border-secondary/20',
          },
          {
            title: 'Fotos Hospedadas',
            value: '42',
            change: '14.2 MB consumidos',
            icon: ImageIcon,
            color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
          },
          {
            title: 'Tráfego Economizado',
            value: '3.4 Giga',
            change: 'Maria Fumaça veloz',
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
              {BROWSER_STATS.map((b) => (
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
              ))}
            </div>
          </div>

          {/* Sistema Operacional */}
          <div className="bg-white p-5 rounded-2xl border border-outline-variant/60 space-y-4">
            <h4 className="font-serif font-extrabold text-sm text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-surface-container pb-3">
              <Laptop className="w-4 h-4 text-secondary" />
              Sistemas Operacionais
            </h4>
            <div className="space-y-4">
              {OS_STATS.map((os) => (
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
              ))}
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
              {COUNTRY_STATS.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center justify-between p-2 rounded-xl bg-surface hover:bg-surface-container-low transition duration-150 border border-outline-variant/20"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl leading-none">{item.flag}</span>
                    <span className="text-xs font-bold text-primary">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/30">
                    {item.count.toLocaleString()} cliques
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
