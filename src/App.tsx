import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useToast } from './contexts/ToastContext';
import { usePhotos } from './contexts/PhotoContext';

// Layout & Guards
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RedirectPage from './pages/RedirectPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardLinksPage from './pages/DashboardLinksPage';
import DashboardPhotosPage from './pages/DashboardPhotosPage';
import DashboardStatsPage from './pages/DashboardStatsPage';
import DashboardSettingsPage from './pages/DashboardSettingsPage';
import ImageViewPage from './pages/ImageViewPage';

// Photo detail (used as overlay inside home)
import PhotoDetail from './components/PhotoDetail';

export default function App() {
  const { toastMessage } = useToast();
  const {
    selectedPhoto,
    handleSelectPhoto,
    photos,
  } = usePhotos();
  const location = useLocation();

  // Clear selected photo on navigation away from home or photo query
  useEffect(() => {
    if (selectedPhoto) {
      handleSelectPhoto(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Handle direct photo links via URL query params or hash
  useEffect(() => {
    const handleUrlParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const photoId = searchParams.get('photo') || searchParams.get('foto');
      const hash = window.location.hash;
      const hashPhotoId = hash.startsWith('#photo-')
        ? hash.substring(7)
        : hash.startsWith('#foto-')
          ? hash.substring(6)
          : hash.startsWith('#photo')
            ? hash.substring(6)
            : hash.startsWith('#foto')
              ? hash.substring(5)
              : null;

      const targetId = photoId || hashPhotoId;
      if (targetId) {
        const foundPhoto = photos.find((p) => {
          const normId = p.id.toLowerCase();
          const normTarget = targetId.toLowerCase();
          return (
            normId === normTarget ||
            normId === `photo-${normTarget}` ||
            normId.replace('photo-', '') === normTarget
          );
        });
        if (foundPhoto) {
          handleSelectPhoto(foundPhoto);
        }
      }
    };

    handleUrlParams();
    window.addEventListener('hashchange', handleUrlParams);
    return () => window.removeEventListener('hashchange', handleUrlParams);
  }, [photos, handleSelectPhoto]);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-secondary/30 selection:text-primary">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast notification */}
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

        {/* Photo detail overlay (supersedes any page when a photo is selected) */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              key="photo-detail-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <PhotoDetail photo={selectedPhoto} onBack={() => handleSelectPhoto(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Route tree */}
        {!selectedPhoto && (
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/redirecting" element={<RedirectPage />} />
              
              {/* Image View Page */}
              <Route path="/i/:shortCode" element={<ImageViewPage />} />

              {/* Protected dashboard routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardLinksPage />} />
                  <Route path="links" element={<DashboardLinksPage />} />
                  <Route path="photos" element={<DashboardPhotosPage />} />
                  <Route path="stats" element={<DashboardStatsPage />} />
                  <Route path="settings" element={<DashboardSettingsPage />} />
                </Route>
              </Route>

              <Route path=":shortCode" element={<RedirectPage />} />

              {/* Catch-all → home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  );
}
