import React, { useState } from 'react';
import { Menu, X, Link as LinkIcon, Image as ImageIcon, BarChart3, LogOut, User, Coffee, Train } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from '../types';
import { LOGO_URL } from '../data';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  currentUser: { email: string; name: string; avatarUrl?: string } | null;
  onLogout: () => void;
}

export default function Header({ currentView, onNavigate, currentUser, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Início', view: 'home' as ViewType, icon: Coffee },
    ...(currentUser
      ? [
          { label: 'Meus Links', view: 'dashboard-links' as ViewType, icon: LinkIcon },
          { label: 'Minhas Fotos', view: 'dashboard-photos' as ViewType, icon: ImageIcon },
          { label: 'Painel Geral', view: 'dashboard-stats' as ViewType, icon: BarChart3 },
        ]
      : []),
  ];

  const handleNavClick = (view: ViewType) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-high shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-surface-container-low border border-primary-container shadow-inner p-[1px]">
              <img
                src={LOGO_URL}
                alt="Tremz.in Logo"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl tracking-tight text-primary leading-none">
                tremz<span className="text-secondary font-sans font-semibold">.in</span>
              </span>
              <span className="text-[10px] font-sans font-medium text-secondary tracking-wider uppercase leading-none mt-1">
                Uai, encurtou!
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view || (item.view === 'dashboard-links' && currentView.startsWith('dashboard'));
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-surface-container-high text-primary border border-outline-variant/30'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Auth State Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-surface-container-highest">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-primary">{currentUser.name}</span>
                  <span className="text-[10px] text-on-surface-variant italic">Mineiro Autenticado</span>
                </div>
                <div 
                  onClick={() => handleNavClick('dashboard-links')}
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm border border-outline-variant cursor-pointer hover:bg-surface-container-highest transition overflow-hidden"
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button
                  onClick={onLogout}
                  title="Sair da Estação"
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low rounded-lg transition cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-2 text-sm font-bold bg-primary text-surface rounded-lg hover:bg-primary-container transition shadow-sm cursor-pointer"
                >
                  Criar Conta
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {currentUser && (
              <div 
                onClick={() => handleNavClick('dashboard-links')}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm border border-outline-variant mr-1 overflow-hidden"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-primary hover:bg-surface-container-low transition cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-container-high bg-surface-container-lowest"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                      isActive
                        ? 'bg-primary text-surface'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <hr className="my-2 border-surface-container" />

              {currentUser ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm border border-outline-variant overflow-hidden shrink-0">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">{currentUser.name}</span>
                      <span className="text-xs text-on-surface-variant overflow-hidden text-ellipsis">{currentUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 text-error font-bold hover:bg-error-container/20 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sair da Estação</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="px-4 py-2.5 text-sm font-bold text-primary border border-outline-variant hover:bg-surface-container-low rounded-lg text-center transition"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => handleNavClick('signup')}
                    className="px-4 py-2.5 text-sm font-bold bg-primary text-surface rounded-lg text-center transition hover:bg-primary-container shadow-xs"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
