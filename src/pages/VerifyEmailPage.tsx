import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { verifyEmailAPI } from '../services/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando sua conta...');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token não encontrado na URL.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyToken = async () => {
      try {
        await verifyEmailAPI(token);
        setStatus('success');
        setMessage('Sua conta foi ativada com sucesso!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Erro ao conectar com o servidor.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <motion.div
      key="verify-email-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto py-10"
    >
      <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6 text-center">
        <div className="space-y-1.5">
          <h1 className="font-serif font-black text-2xl text-primary">Confirmação de E-mail</h1>
          <p className="text-xs text-on-surface-variant">Estamos validando seu passe de trem.</p>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-primary">⏳ {message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 text-3xl">
              ✅
            </div>
            <p className="text-sm font-bold text-green-700">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm"
            >
              Ir para o Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 py-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 text-red-600 text-3xl">
              ❌
            </div>
            <p className="text-sm font-bold text-red-700">{message}</p>
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm"
            >
              Tentar cadastrar novamente
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
