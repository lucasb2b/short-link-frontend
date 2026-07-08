import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErr, setFormErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    setLoading(true);

    const result = await handleLogin(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard/links');
    } else {
      setFormErr(result.error ?? t('auth.errorGeneric'));
    }
  };

  return (
    <motion.div
      key="login-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto py-10"
    >
      <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="font-serif font-black text-2xl text-primary">{t('auth.loginTitle')}</h1>
          <p className="text-xs text-on-surface-variant">{t('auth.loginSubtitle')}</p>
        </div>

        {formErr && (
          <div className="p-3 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
            {formErr}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">{t('auth.email')}</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">{t('auth.password')}</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-secondary font-bold hover:underline">
              {t('auth.forgotPasswordLink')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm"
          >
            {loading ? t('auth.loading') : t('auth.loginButton')}
          </button>
        </form>

        <p className="text-xs text-center text-on-surface-variant font-medium">
          {t('auth.noAccount')}{' '}
          <Link to="/signup" className="text-secondary font-bold hover:underline">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}