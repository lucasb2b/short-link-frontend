import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function SignupPage() {
  const { handleSignup } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErr, setFormErr] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    const result = handleSignup(name, email, password);
    if (result.success) {
      navigate('/dashboard/links');
    } else {
      setFormErr(result.error ?? 'Erro ao criar conta.');
    }
  };

  return (
    <motion.div
      key="signup-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto py-10"
    >
      <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-xs space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="font-serif font-black text-2xl text-primary">Criar Conta na Estação</h1>
          <p className="text-xs text-on-surface-variant">Cadastre-se grátis e guarde suas estatísticas de trem bão</p>
        </div>

        {formErr && (
          <div className="p-3 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
            {formErr}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Nome Completo</label>
            <input
              type="text"
              id="signup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lucas Brito"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Seu E-mail</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Definir Senha</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Escolha uma senha bacana"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
          </div>

          <button
            type="submit"
            id="signup-submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm"
          >
            Criar meu Passe de Trem
          </button>
        </form>

        <p className="text-xs text-center text-on-surface-variant font-medium">
          Já possui passe de trem?{' '}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Ir pro Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
