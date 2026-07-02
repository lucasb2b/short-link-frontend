import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { resetPasswordAPI } from '../services/api';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { evaluatePasswordStrength } from '../utils/password';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de redefinição não encontrado na URL.');
    }
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('As senhas não coincidem.');
      return;
    }

    const strength = evaluatePasswordStrength(newPassword);
    if (strength.score < 2 || newPassword.length < 8) {
      setStatus('error');
      setMessage('Sua senha é muito fraca ou curta. Por favor, crie uma senha mais forte (mínimo 8 caracteres, mesclando letras e números/símbolos).');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await resetPasswordAPI(token!, newPassword);
      setStatus('success');
      setMessage('Senha redefinida com sucesso!');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Erro ao redefinir a senha. O link pode ter expirado.');
    }
  };

  return (
    <motion.div
      key="reset-password-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto py-10"
    >
      <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="font-serif font-black text-2xl text-primary">Redefinir Senha</h1>
          <p className="text-xs text-on-surface-variant">Crie uma nova senha para acessar sua conta</p>
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
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary block">Nova Senha</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Escolha uma senha forte"
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
              />
              {newPassword && <PasswordStrengthMeter password={newPassword} />}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary block">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !token}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm disabled:opacity-50 mt-2"
            >
              {status === 'loading' ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
