import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { evaluatePasswordStrength } from '../utils/password';

export default function SignupPage() {
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formErr, setFormErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (password !== confirmPassword) {
      setFormErr('As senhas não coincidem.');
      return;
    }

    const strength = evaluatePasswordStrength(password);
    if (strength.score < 2 || password.length < 8) {
      setFormErr('Sua senha é muito fraca ou curta. Por favor, crie uma senha mais forte (mínimo 8 caracteres, mesclando letras e números/símbolos).');
      return;
    }

    if (!termsAccepted) {
      setFormErr('Você precisa aceitar os Termos de Uso para continuar.');
      return;
    }

    setLoading(true);

    const result = await handleSignup(name, email, password);
    setLoading(false);

    if (result.success) {
      // Não navegamos direto para o dashboard, mas para o login com uma mensagem
      navigate('/login', { state: { message: 'Conta criada! Verifique seu e‑mail.' } });
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
              required
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
              required
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Escolha uma senha bacana"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
            {password && <PasswordStrengthMeter password={password} />}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary block">Confirmar Senha</label>
            <input
              type="password"
              id="signup-confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-primary"
            />
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-primary block mb-2">Termos de Uso e Privacidade</label>
            <div className="h-32 overflow-y-auto p-3 bg-surface-variant/30 border border-outline-variant rounded-xl text-[11px] text-on-surface-variant leading-relaxed mb-3">
              <p className="font-bold mb-1">1. Aceitação e Responsabilidade (LGPD)</p>
              <p className="mb-2">Ao se cadastrar na plataforma Tremz.in, você concorda com a coleta do seu nome e e-mail estritamente para fins de autenticação e funcionamento do sistema, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Seus dados não serão vendidos ou repassados a terceiros.</p>
              
              <p className="font-bold mb-1">2. Conteúdo Gerado pelo Usuário</p>
              <p className="mb-2">A plataforma Tremz.in não se responsabiliza pelo teor, legalidade ou segurança dos links encurtados ou das imagens hospedadas pelos usuários. Todo e qualquer conteúdo inserido é de inteira responsabilidade do usuário que o gerou. Nós nos reservamos o direito de remover URLs que violem a lei ou os termos sem aviso prévio.</p>
            </div>
            
            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-xs text-on-surface-variant group-hover:text-primary transition-colors">
                Eu li e aceito os termos de uso e declaro estar ciente de minhas responsabilidades.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition shadow-xs cursor-pointer text-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Criando passe...' : 'Criar meu Passe de Trem'}
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
