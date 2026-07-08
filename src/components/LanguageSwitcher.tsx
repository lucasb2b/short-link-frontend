import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all cursor-pointer border border-outline-variant/30"
      title={i18n.language === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{i18n.language === 'pt-BR' ? 'EN' : 'BR'}</span>
    </button>
  );
}