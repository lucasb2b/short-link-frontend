import React, { useState, useEffect } from 'react';
import { 
  Coffee, Link2, Image as ImageIcon, BarChart3, LogOut, ArrowRight, Copy, 
  Check, Trash2, Plus, Sparkles, LogIn, UserPlus, FileText, LayoutDashboard, Globe, ExternalLink, ShieldAlert, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LinkItem, PhotoItem, ViewType } from './types';
import { INITIAL_LINKS, INITIAL_PHOTOS } from './data';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LinkShortener from './components/LinkShortener';
import PhotoUploader from './components/PhotoUploader';
import PublicGallery from './components/PublicGallery';
import PhotoDetail from './components/PhotoDetail';
import StatsPanel from './components/StatsPanel';
import SettingsPanel from './components/SettingsPanel';
import LoadingSpinner from './components/LoadingSpinner';
import RedirectScreen from './components/RedirectScreen';
import LinkStatsModal from './components/LinkStatsModal';
import PhotoDetailModal from './components/PhotoDetailModal';

export default function App() {
  // Global States with localStorage persistence
  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('tremz_links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('tremz_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; avatarUrl?: string } | null>(() => {
    const saved = localStorage.getItem('tremz_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('tremz_users');
    const initial = [{ email: 'lucasbritocientista@gmail.com', name: 'Lucas Brito', password: '123' }];
    if (!saved) {
      localStorage.setItem('tremz_users', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  });

  // Navigation and Interactive view state
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeHomeTab, setActiveHomeTab] = useState<'link' | 'photo'>('link');
  const [redirectingLink, setRedirectingLink] = useState<LinkItem | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [formErr, setFormErr] = useState('');

  // Toast status notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);

  // Link statistics modal states
  const [selectedStatsLink, setSelectedStatsLink] = useState<LinkItem | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Photo modal states for dashboard management
  const [selectedDashboardPhoto, setSelectedDashboardPhoto] = useState<PhotoItem | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Pagination states
  const [linksPage, setLinksPage] = useState(1);
  const [photosPage, setPhotosPage] = useState(1);

  // Pagination helpers
  const linksPerPage = 10;
  const totalLinksPages = Math.ceil(links.length / linksPerPage) || 1;
  const safeLinksPage = Math.min(Math.max(1, linksPage), totalLinksPages);
  const paginatedLinks = links.slice((safeLinksPage - 1) * linksPerPage, safeLinksPage * linksPerPage);

  const photosPerPage = 10;
  const totalPhotosPages = Math.ceil(photos.length / photosPerPage) || 1;
  const safePhotosPage = Math.min(Math.max(1, photosPage), totalPhotosPages);
  const paginatedPhotos = photos.slice((safePhotosPage - 1) * photosPerPage, safePhotosPage * photosPerPage);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('tremz_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('tremz_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tremz_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tremz_user');
    }
  }, [currentUser]);

  // Synchronized select/deselect with URL search parameter
  const handleSelectPhoto = (photo: PhotoItem | null) => {
    setSelectedPhoto(photo);
    if (photo) {
      const url = new URL(window.location.href);
      url.searchParams.set('photo', photo.id.replace('photo-', ''));
      window.history.pushState({}, '', url.pathname + url.search);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('photo');
      url.searchParams.delete('foto');
      window.history.pushState({}, '', url.pathname + url.search);
    }
  };

  // Handle direct photo links via URL query params or Hash
  useEffect(() => {
    const handleUrlParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const photoId = searchParams.get('photo') || searchParams.get('foto');
      const hash = window.location.hash;
      const hashPhotoId = hash.startsWith('#photo-') ? hash.substring(7) : (hash.startsWith('#foto-') ? hash.substring(6) : (hash.startsWith('#photo') ? hash.substring(6) : (hash.startsWith('#foto') ? hash.substring(5) : null)));
      
      const targetId = photoId || hashPhotoId;
      if (targetId) {
        const foundPhoto = photos.find(p => {
          const normId = p.id.toLowerCase();
          const normTarget = targetId.toLowerCase();
          return normId === normTarget || 
                 normId === `photo-${normTarget}` || 
                 normId.replace('photo-', '') === normTarget;
        });
        if (foundPhoto) {
          setSelectedPhoto(foundPhoto);
          setCurrentView('home');
        }
      }
    };

    handleUrlParams();
    window.addEventListener('hashchange', handleUrlParams);
    return () => window.removeEventListener('hashchange', handleUrlParams);
  }, [photos]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Action: Shorten a link
  const handleShortenLink = async (originalUrl: string): Promise<LinkItem> => {
    // Generate a beautiful short path with random alphanumeric characters
    const randomPath = Math.random().toString(36).substring(2, 8);
    const newLink: LinkItem = {
      id: Date.now().toString(),
      originalUrl,
      shortUrl: `tremz.in/${randomPath}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
      trend: 'stable'
    };
    setLinks((prev) => [newLink, ...prev]);
    showToast('Trem encurtado com sucesso, uai!');
    return newLink;
  };

  // Action: Upload a photo
  const handleUploadPhoto = async (photoData: Omit<PhotoItem, 'id' | 'createdAt'>): Promise<PhotoItem> => {
    const newPhoto: PhotoItem = {
      ...photoData,
      id: `photo-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    showToast('Sua foto foi hospedada!');
    return newPhoto;
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Link removido do painel!');
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Foto excluída da estação!');
  };

  // Simulated Authorization actions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (!loginEmail || !loginPass) {
      setFormErr('Preencha os campos obrigatórios primeiro!');
      return;
    }

    const matched = registeredUsers.find(
      (u: any) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPass
    );

    if (matched) {
      setCurrentUser({ email: matched.email, name: matched.name, avatarUrl: matched.avatarUrl });
      showToast(`Bem-vindo à estação, ${matched.name}!`);
      setCurrentView('dashboard-links');
      setLoginEmail('');
      setLoginPass('');
    } else {
      setFormErr('Eita! Usuário ou senha incorretos, confere de novo.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (!signupName || !signupEmail || !signupPass) {
      setFormErr('Preencha todos os campos do cadastro do trem!');
      return;
    }

    const exists = registeredUsers.some((u: any) => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (exists) {
      setFormErr('Uai, esse e-mail já tá cadastrado aqui na estação.');
      return;
    }

    const newUser = { name: signupName, email: signupEmail, password: signupPass, avatarUrl: '' };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('tremz_users', JSON.stringify(updatedUsers));

    setCurrentUser({ email: signupEmail, name: signupName, avatarUrl: '' });
    showToast(`Registrado com sucesso, sô!`);
    setCurrentView('dashboard-links');
    setSignupName('');
    setSignupEmail('');
    setSignupPass('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Saiu da estação. Volte logo, sô!');
    setCurrentView('home');
  };

  const handleUpdateProfile = (updatedData: { name?: string; password?: string; avatarUrl?: string }) => {
    if (!currentUser) return;

    setRegisteredUsers(prev => {
      const users = [...prev];
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      if (userIndex > -1) {
        if (updatedData.name) users[userIndex].name = updatedData.name;
        if (updatedData.password) users[userIndex].password = updatedData.password;
        if (updatedData.avatarUrl !== undefined) users[userIndex].avatarUrl = updatedData.avatarUrl;
        localStorage.setItem('tremz_users', JSON.stringify(users));
      }
      return users;
    });

    setCurrentUser(prev => {
      if (!prev) return prev;
      const newUser = { ...prev };
      if (updatedData.name) newUser.name = updatedData.name;
      if (updatedData.avatarUrl !== undefined) newUser.avatarUrl = updatedData.avatarUrl;
      return newUser;
    });

    showToast('Configurações atualizadas, sô!');
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;

    setRegisteredUsers(prev => {
      const updated = prev.filter(u => u.email !== currentUser.email);
      localStorage.setItem('tremz_users', JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(null);
    showToast('Sua conta foi excluída com sucesso. Sentiremos sua falta por aqui, sô!');
    setCurrentView('home');
  };

  const handleOpenStatsModal = (link: LinkItem) => {
    setSelectedStatsLink(link);
    setIsStatsModalOpen(true);
  };

  const handleCloseStatsModal = () => {
    setIsStatsModalOpen(false);
    setSelectedStatsLink(null);
  };

  const handleOpenPhotoModal = (photo: PhotoItem) => {
    setSelectedDashboardPhoto(photo);
    setIsPhotoModalOpen(true);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setSelectedDashboardPhoto(null);
  };

  // Direct redirection trigger
  const triggerRedirect = (link: LinkItem) => {
    // Increment clicks
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === link.id) {
          return { ...l, clicks: l.clicks + 1, trend: 'up' };
        }
        return l;
      })
    );
    setRedirectingLink(link);
    setCurrentView('redirecting');
  };

  // Clipboard copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 3000);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-secondary/30 selection:text-primary">
      {/* Navbar Header navigation panel */}
      <Header 
        currentView={currentView} 
        onNavigate={(view) => {
          handleSelectPhoto(null);
          setCurrentView(view);
        }} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* Main Container body spacer */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toast status */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-primary-container text-white border border-outline border-l-4 border-l-secondary rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-secondary-container" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View switching logic layout */}
        <AnimatePresence mode="wait">
          
          {/* HOME SCREEN OR DETAILS OR REDIRECTS */}
          {currentView === 'home' && !selectedPhoto && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* HERO BANNER SECTION */}
              <div className="text-center max-w-3xl mx-auto space-y-4 py-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/60">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span className="text-[11px] font-sans font-bold text-primary tracking-wide uppercase">
                    Plataforma 100% Funcional e Veloz
                  </span>
                </div>

                <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-primary tracking-tight leading-none">
                  O encurtador de links mais <span className="text-secondary italic underline decoration-wavy decoration-outline-variant/40">mineiro</span> da web!
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-on-surface-variant font-medium max-w-xl mx-auto leading-relaxed">
                  Encurte seus links e suba suas fotos num piscar de olhos, sem complicação de trem difícil. Com links diretos prontinhos para incorporar em HTML!
                </p>
              </div>

              {/* TABS SELECTOR (Encurtar Link vs Hospedar Imagem) */}
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex bg-surface-container rounded-2xl p-1.5 border border-outline-variant/40 shrink-0">
                  <button
                    onClick={() => setActiveHomeTab('link')}
                    className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      activeHomeTab === 'link'
                        ? 'bg-primary text-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Encurtar Link</span>
                  </button>

                  <button
                    onClick={() => setActiveHomeTab('photo')}
                    className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      activeHomeTab === 'photo'
                        ? 'bg-primary text-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Hospedar Foto</span>
                  </button>
                </div>

                {/* Show Selected Tab component */}
                <div className="relative">
                  {activeHomeTab === 'link' ? (
                    <LinkShortener onShorten={handleShortenLink} />
                  ) : (
                    <PhotoUploader onUpload={handleUploadPhoto} />
                  )}
                </div>
              </div>

              {/* PUBLIC GALLERY PREVIEW RETRATOS */}
              <div className="pt-8 border-t border-surface-container-high">
                <PublicGallery 
                  photos={photos} 
                  onSelectPhoto={(photo) => {
                    handleSelectPhoto(photo);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              </div>
            </motion.div>
          )}

          {/* VIEW: REDIRECTING SIMULATION PAGE */}
          {currentView === 'redirecting' && redirectingLink && (
            <motion.div
              key="redirecting-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <RedirectScreen 
                link={redirectingLink} 
                onCancel={() => {
                  setRedirectingLink(null);
                  setCurrentView('home');
                }} 
              />
            </motion.div>
          )}

          {/* VIEW: PHOTO DETAILS */}
          {selectedPhoto && (
            <motion.div
              key="photo-detail-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <PhotoDetail 
                photo={selectedPhoto} 
                onBack={() => handleSelectPhoto(null)} 
              />
            </motion.div>
          )}

          {/* PAGE: SIGN IN / ENTRAR NA ESTAÇÃO */}
          {currentView === 'login' && (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto py-10"
            >
              <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6">
                <div className="text-center space-y-1.5">
                  <h3 className="font-serif font-black text-2xl text-primary">Entrar na Estação</h3>
                  <p className="text-xs text-on-surface-variant">Acesse seus links encortados e fotos guardadas</p>
                </div>

                {formErr && (
                  <div className="p-3 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
                    {formErr}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary block">Seu E-mail</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="lucasbritocientista@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary block">Sua Senha</label>
                    <input
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Digite sua senha"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm"
                  >
                    Entrar no Trilho
                  </button>
                </form>

                <p className="text-xs text-center text-on-surface-variant font-medium">
                  Não possui conta ainda?{' '}
                  <button onClick={() => setCurrentView('signup')} className="text-secondary font-bold hover:underline cursor-pointer">
                    Fazer Cadastro
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* PAGE: REGISTER / CADASTRO DE MINEIRO */}
          {currentView === 'signup' && (
            <motion.div
              key="signup-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto py-10"
            >
              <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6">
                <div className="text-center space-y-1.5">
                  <h3 className="font-serif font-black text-2xl text-primary">Criar Conta na Estação</h3>
                  <p className="text-xs text-on-surface-variant">Cadastre-se grátis e guarde suas estatísticas de trem bão</p>
                </div>

                {formErr && (
                  <div className="p-3 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
                    {formErr}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary block">Nome Completo</label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Lucas Brito"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary block">Seu E-mail</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary block">Definir Senha</label>
                    <input
                      type="password"
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      placeholder="Escolha uma senha bacana"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm"
                  >
                    Criar meu Passe de Trem
                  </button>
                </form>

                <p className="text-xs text-center text-on-surface-variant font-medium">
                  Já possui passe de trem?{' '}
                  <button onClick={() => setCurrentView('login')} className="text-secondary font-bold hover:underline cursor-pointer">
                    Ir pro Login
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* DASHBOARD SECTIONS (MEMBER'S AREA) */}
          {(currentView === 'dashboard-links' || currentView === 'dashboard-photos' || currentView === 'dashboard-stats' || currentView === 'dashboard-settings') && currentUser && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-8"
            >
              
              {/* MEMBER SIDEBAR COMPONENT (DASHBOARD) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-3xl border border-outline-variant/60 p-5 space-y-4 shadow-xs">
                  <div className="text-center p-3 bg-surface-container rounded-2xl border border-outline-variant/20 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary text-white mx-auto flex items-center justify-center font-extrabold text-lg border border-outline-variant overflow-hidden">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-extrabold text-primary">{currentUser.name}</h4>
                      <p className="text-[10px] text-on-surface-variant/80 italic">Passageiro de Primeira Classe</p>
                    </div>
                  </div>

                  {/* Sidebar Nav Buttons */}
                  <nav className="flex flex-col space-y-1.5 pt-2">
                    <button
                      onClick={() => setCurrentView('dashboard-links')}
                      className={`w-full px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left flex items-center space-x-2.5 ${
                        currentView === 'dashboard-links'
                          ? 'bg-primary text-surface'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                      }`}
                    >
                      <Link2 className="w-4 h-4 shrink-0" />
                      <span>Meus Links Encurtados</span>
                    </button>

                    <button
                      onClick={() => setCurrentView('dashboard-photos')}
                      className={`w-full px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left flex items-center space-x-2.5 ${
                        currentView === 'dashboard-photos'
                          ? 'bg-primary text-surface'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 shrink-0" />
                      <span>Minhas Fotos</span>
                    </button>

                    <button
                      onClick={() => setCurrentView('dashboard-stats')}
                      className={`w-full px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left flex items-center space-x-2.5 ${
                        currentView === 'dashboard-stats'
                          ? 'bg-primary text-surface'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      <span>Painel Estatístico</span>
                    </button>

                    <button
                      onClick={() => setCurrentView('dashboard-settings')}
                      className={`w-full px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left flex items-center space-x-2.5 ${
                        currentView === 'dashboard-settings'
                          ? 'bg-primary text-surface'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                      }`}
                    >
                      <Settings className="w-4 h-4 shrink-0" />
                      <span>Configurações</span>
                    </button>
                  </nav>

                  <hr className="border-surface-container" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-error bg-error-container/10 border border-error-container/20 hover:bg-error-container/20 transition-all cursor-pointer text-left flex items-center space-x-2.5"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sair da Estação</span>
                  </button>
                </div>
              </div>

              {/* ACTION CORRESPONDING DASHBOARD AREA */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* SUBVIEW: LINKS LIST & CREATION */}
                {currentView === 'dashboard-links' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-serif font-black text-2xl text-primary">Meus Links Encurtados</h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">Crie e gerencie seus caminhos encurtados</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setActiveHomeTab('link');
                        }}
                        className="px-4 py-2 bg-primary text-surface font-semibold text-xs rounded-xl hover:bg-primary-container transition flex items-center space-x-1 shadow-sm shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Novo Link</span>
                      </button>
                    </div>

                    {links.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-3xl border border-outline-variant/60 italic text-on-surface-variant text-sm font-medium">
                        Você ainda não encurtou nenhum link, uai! Clique em "Novo Link" ali em cima para gerar seu primeiro trem.
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-surface-container border-b border-outline-variant/40">
                                <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif">Destino Original</th>
                                <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif">Código Encurtado</th>
                                <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif text-center">Cliques</th>
                                <th className="p-4 text-xs font-bold tracking-wider uppercase text-primary font-serif text-center">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                              {paginatedLinks.map((link) => (
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
                                      Criado em: {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-xs font-extrabold text-secondary">
                                    <div className="flex items-center space-x-1.5">
                                      <span className="truncate">{link.shortUrl}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          triggerRedirect(link);
                                        }}
                                        className="p-1 text-primary hover:text-secondary hover:bg-surface-container rounded-md transition cursor-pointer shrink-0"
                                        title="Simular cliques do visitante neste link"
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenStatsModal(link);
                                        }}
                                        className="p-1.5 bg-surface-container-high/60 border border-outline-variant/40 hover:bg-surface-container-high text-primary hover:text-secondary rounded-lg transition cursor-pointer"
                                        title="Ver Estatísticas Detalhadas"
                                      >
                                        <BarChart3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyText(`${window.location.origin}/${link.shortUrl.split('/')[1]}`, link.id);
                                        }}
                                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                          isCopiedId === link.id
                                            ? 'bg-tertiary/10 text-tertiary border-tertiary-container'
                                            : 'bg-surface-container-high/60 border-outline-variant/40 hover:bg-surface-container-high text-primary'
                                        }`}
                                        title="Copiar Link"
                                      >
                                        {isCopiedId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteLink(link.id);
                                        }}
                                        className="p-1.5 bg-error-container/10 border border-error-container/20 text-error hover:bg-error-container/20 rounded-lg transition cursor-pointer"
                                        title="Remover Link"
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
                        {/* Pagination footer */}
                        <div className="p-4 border-t border-outline-variant/50 flex flex-col sm:flex-row justify-between items-center bg-surface-container-low gap-3">
                          <span className="text-xs text-on-surface-variant font-medium">
                            Mostrando {((safeLinksPage - 1) * linksPerPage) + 1} a {Math.min(safeLinksPage * linksPerPage, links.length)} de o total de {links.length} caminhos
                          </span>
                          {totalLinksPages > 1 && (
                            <div className="flex items-center space-x-1 flex-wrap gap-1">
                              <button
                                disabled={safeLinksPage === 1}
                                onClick={() => setLinksPage(p => Math.max(1, p - 1))}
                                className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${
                                  safeLinksPage === 1
                                    ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                                }`}
                              >
                                Voltar Trem
                              </button>
                              {Array.from({ length: totalLinksPages }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setLinksPage(i + 1)}
                                  className={`w-7 h-7 flex items-center justify-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border ${
                                    safeLinksPage === i + 1
                                      ? 'bg-primary border-primary text-surface font-black'
                                      : 'border-outline-variant hover:bg-surface-container-high/60 text-primary bg-white'
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                              <button
                                disabled={safeLinksPage === totalLinksPages}
                                onClick={() => setLinksPage(p => Math.min(totalLinksPages, p + 1))}
                                className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${
                                  safeLinksPage === totalLinksPages
                                    ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                                }`}
                              >
                                Tocar Diante
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUBVIEW: PHOTOS GALLERY MANAGEMENT */}
                {currentView === 'dashboard-photos' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-serif font-black text-2xl text-primary">Minhas Fotos Hospedadas</h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">Guarde, baixe e copie links diretos HTML das suas imagens</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setActiveHomeTab('photo');
                        }}
                        className="px-4 py-2 bg-primary text-surface font-semibold text-xs rounded-xl hover:bg-primary-container transition flex items-center space-x-1 shadow-sm shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Hospedar Outra</span>
                      </button>
                    </div>

                    {photos.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-3xl border border-outline-variant/60 italic text-on-surface-variant text-sm font-medium">
                        Sua galeria de fotos está vazia, sô! Suba um retrato lindo clicando no painel.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                          {paginatedPhotos.map((photo) => (
                            <div key={photo.id} className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
                              {/* Clickable Image Container */}
                              <div 
                                onClick={() => handleOpenPhotoModal(photo)}
                                className="relative aspect-video overflow-hidden bg-surface-container cursor-pointer group/img"
                                title="Clique para ver imagem e detalhes"
                              >
                                <img 
                                  src={photo.imageUrl} 
                                  alt={photo.fileName} 
                                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out" 
                                />
                                <span className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs text-white ${photo.isPrivate ? 'bg-error/80' : 'bg-tertiary/80'}`}>
                                  {photo.isPrivate ? 'Privado 🔒' : 'Público 🌍'}
                                </span>
                                <span className="absolute top-2 right-2 bg-black/60 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                                  {photo.size}
                                </span>
                                {/* Visual Hover Indicator Overlay */}
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="bg-surface/90 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm scale-90 group-hover/img:scale-100 transition-transform">
                                    Ver Detalhes 🔍
                                  </span>
                                </div>
                              </div>
                              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                <div 
                                  onClick={() => handleOpenPhotoModal(photo)}
                                  className="cursor-pointer group/title"
                                  title="Clique para ver detalhes"
                                >
                                  <h4 className="text-xs font-serif font-extrabold text-primary truncate group-hover/title:text-secondary group-hover/title:underline transition" title={photo.fileName}>
                                    {photo.fileName}
                                  </h4>
                                  <p className="text-[10px] text-on-surface-variant p-1 bg-surface-container rounded-sm font-mono mt-1 font-bold truncate">
                                    {photo.imageUrl.startsWith('data:') ? 'Memória Local Simulado' : photo.imageUrl}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-surface-container">
                                  <button
                                    onClick={() => handleOpenPhotoModal(photo)}
                                    className="text-[10px] font-extrabold text-primary hover:text-secondary hover:underline cursor-pointer flex items-center gap-0.5"
                                  >
                                    <span>Abrir Links HTML</span>
                                    <span>🔍</span>
                                  </button>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleCopyText(photo.imageUrl, photo.id)}
                                      className={`p-1.5 rounded-lg border transition ${
                                        isCopiedId === photo.id
                                          ? 'bg-tertiary/10 text-tertiary border-tertiary-container'
                                          : 'bg-surface-container-high/60 border-outline-variant/40 hover:bg-surface-container-high text-primary'
                                      }`}
                                    >
                                      {isCopiedId === photo.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      onClick={() => handleDeletePhoto(photo.id)}
                                      className="p-1.5 bg-error-container/10 border border-error-container/20 text-error hover:bg-error-container/20 rounded-lg transition"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Photos Pagination footer */}
                        <div className="p-4 bg-white border border-outline-variant/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
                          <span className="text-xs text-on-surface-variant font-medium">
                            Mostrando {((safePhotosPage - 1) * photosPerPage) + 1} a {Math.min(safePhotosPage * photosPerPage, photos.length)} de o total de {photos.length} retratos
                          </span>
                          {totalPhotosPages > 1 && (
                            <div className="flex items-center space-x-1 flex-wrap gap-1">
                              <button
                               disabled={safePhotosPage === 1}
                               onClick={() => setPhotosPage(p => Math.max(1, p - 1))}
                               className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${
                                 safePhotosPage === 1
                                   ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                                   : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                               }`}
                             >
                               Voltar Trem
                             </button>
                             {Array.from({ length: totalPhotosPages }).map((_, i) => (
                               <button
                                 key={i}
                                 onClick={() => setPhotosPage(i + 1)}
                                 className={`w-7 h-7 flex items-center justify-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border ${
                                   safePhotosPage === i + 1
                                     ? 'bg-primary border-primary text-surface font-black'
                                     : 'border-outline-variant hover:bg-surface-container-high/60 text-primary bg-white'
                                 }`}
                               >
                                 {i + 1}
                               </button>
                             ))}
                             <button
                               disabled={safePhotosPage === totalPhotosPages}
                               onClick={() => setPhotosPage(p => Math.min(totalPhotosPages, p + 1))}
                               className={`px-2.5 py-1.5 text-[10px] font-extrabold border rounded-lg transition-all cursor-pointer ${
                                 safePhotosPage === totalPhotosPages
                                   ? 'border-outline-variant/40 text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                                   : 'border-outline-variant hover:border-primary hover:bg-surface-container-high/60 text-primary bg-white'
                               }`}
                             >
                               Tocar Diante
                             </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUBVIEW: STATISTICS OUTCOMES */}
                {currentView === 'dashboard-stats' && (
                  <StatsPanel />
                )}

                {/* SUBVIEW: SETTINGS PANEL */}
                {currentView === 'dashboard-settings' && (
                  <SettingsPanel 
                    currentUser={currentUser} 
                    onUpdateProfile={handleUpdateProfile} 
                    onDeleteAccount={handleDeleteAccount}
                    registeredUsers={registeredUsers}
                  />
                )}

                <LinkStatsModal
                  isOpen={isStatsModalOpen}
                  onClose={handleCloseStatsModal}
                  link={selectedStatsLink}
                />

                <PhotoDetailModal
                  isOpen={isPhotoModalOpen}
                  onClose={handleClosePhotoModal}
                  photo={selectedDashboardPhoto}
                />

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Footer component */}
      <Footer onNavigate={(view) => {
        handleSelectPhoto(null);
        setCurrentView(view);
      }} />
    </div>
  );
}
