import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-surface mt-auto border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif font-extrabold text-2xl tracking-tight text-white">
              tremz<span className="text-secondary-container font-sans font-semibold">.in</span>
            </h3>
            <p className="text-sm text-on-primary-container leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container-high/10 rounded-full text-xs text-on-primary-container border border-surface-container-high/20 italic font-serif">
              <Coffee className="w-3.5 h-3.5 text-secondary-container animate-pulse" />
              <span>{t('footer.quote')}</span>
            </div>
          </div>

          {/* Quick nav */}
          <div className="space-y-4 md:pl-8">
            <h4 className="text-xs font-bold tracking-wider uppercase text-on-primary-container">
              {t('footer.stations')}
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container/80">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition">
                  {t('footer.homePage')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white hover:underline transition">
                  {t('footer.loginPanel')}
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white hover:underline transition">
                  {t('footer.createAccount')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Culture */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-on-primary-container">
              {t('footer.hospitality')}
            </h4>
            <p className="text-sm text-on-primary-container/80 leading-relaxed">
              {t('footer.cultureText')}
            </p>
            <div className="pt-2 text-xs text-on-primary-container/60">
              <span className="font-mono">{t('footer.version')}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-surface-container-high/20 flex flex-col sm:flex-row items-center justify-between text-xs text-on-primary-container/60">
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>{t('footer.developedWith')}</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" />
            <span>{t('footer.inBrasilia')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}