import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { forgotPasswordAPI } from '../services/api';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await forgotPasswordAPI(email);
      setStatus('success');
      setMessage(t('auth.successForgot'));
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || t('auth.errorGeneric'));
    }
  };

  return (
    <motion.div
      key="forgot-password-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto py-10"
    >
      <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="font-serif font-black text-2xl text-primary">{t('auth.forgotTitle')}</h1>
          <p className="text-xs text-on-surface-variant">{t('auth.forgotSubtitle')}</p>
        </div>

        {status === 'error' && (
          <div className="p-3 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
            {message}
          </div>
        )}

        {status === 'success' ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-3xl">
              ✅
            </div>
            <p className="text-sm font-bold text-green-700">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs text-sm text-center"
            >
              {t('auth.loginLink')}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary block">{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm disabled:opacity-50"
            >
              {status === 'loading' ? t('auth.loading') : t('auth.forgotButton')}
            </button>
          </form>
        )}

        {status !== 'success' && (
          <p className="text-xs text-center text-on-surface-variant font-medium">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-secondary font-bold hover:underline">
              {t('auth.loginLink')}
            </Link>
          </p>
        )}
      </div>
    </motion.div>
  );
}