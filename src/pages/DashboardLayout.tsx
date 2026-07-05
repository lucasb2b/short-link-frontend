import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Link2, Image as ImageIcon, BarChart3, Settings, LogOut,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLinks } from '../contexts/LinkContext';
import { usePhotos } from '../contexts/PhotoContext';
import LinkStatsModal from '../components/LinkStatsModal';
import PhotoDetailModal from '../components/PhotoDetailModal';

/**
 * DashboardLayout — shared shell for all /dashboard/* routes.
 * Renders the user sidebar on the left and an <Outlet> on the right
 * for the actual sub-page (links, photos, stats, settings).
 */
export default function DashboardLayout() {
  const {
    currentUser,
    handleLogout,
  } = useAuth();
  
  const {
    isStatsModalOpen, handleCloseStatsModal, selectedStatsLink
  } = useLinks();

  const {
    isPhotoModalOpen, handleClosePhotoModal, selectedDashboardPhoto
  } = usePhotos();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left flex items-center space-x-2.5 ${
      isActive
        ? 'bg-primary text-surface'
        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
    }`;

  return (
    <motion.div
      key="dashboard-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-8"
    >
      {/* SIDEBAR */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white rounded-3xl border border-outline-variant/60 p-5 space-y-4 shadow-xs">
          {/* User card */}
          <div className="text-center p-3 bg-surface-container rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary text-white mx-auto flex items-center justify-center font-extrabold text-lg border border-outline-variant overflow-hidden">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser?.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h4 className="text-sm font-serif font-extrabold text-primary">{currentUser?.name}</h4>
              <p className="text-[10px] text-on-surface-variant/80 italic">Passageiro de Primeira Classe</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col space-y-1.5 pt-2">
            <NavLink to="/dashboard/links" className={navLinkClass} end>
              <Link2 className="w-4 h-4 shrink-0" />
              <span>Meus Links Encurtados</span>
            </NavLink>

            <NavLink to="/dashboard/photos" className={navLinkClass} end>
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Minhas Fotos</span>
            </NavLink>

            <NavLink to="/dashboard/stats" className={navLinkClass} end>
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Painel Estatístico</span>
            </NavLink>

            <NavLink to="/dashboard/settings" className={navLinkClass} end>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Configurações</span>
            </NavLink>
          </nav>

          <hr className="border-surface-container" />

          <button
            onClick={onLogout}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-error bg-error-container/10 border border-error-container/20 hover:bg-error-container/20 transition-all cursor-pointer text-left flex items-center space-x-2.5"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sair da Estação</span>
          </button>
        </div>
      </div>

      {/* CONTENT AREA — renders the matched sub-route */}
      <div className="lg:col-span-9 space-y-6">
        <Outlet />

        {/* Shared Modals */}
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
  );
}
