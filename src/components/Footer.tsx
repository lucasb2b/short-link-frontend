import React from 'react';
import { Sparkles, Heart, Coffee } from 'lucide-react';
import { ViewType } from '../types';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const sayings = [
    "Mais vale um pássaro na mão que dois voando, sô!",
    "Arreda o pé do trem ruim e vem encurtar!",
    "Café com pão de queijo quentinho é bão demais da conta!",
    "Quem tem pressa come cru, mas no Tremz.in é rapidinho!",
    "Tem base um trem desse? Funciona bem pra daná!",
    "De grão em grão a galinha enche o papo!"
  ];

  // Pick a stable saying or rotate
  const randomSaying = sayings[2]; // "Café com pão de queijo quentinho é bão..."

  return (
    <footer className="bg-primary text-surface mt-auto border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif font-extrabold text-2xl tracking-tight text-white">
              tremz<span className="text-secondary-container font-sans font-semibold">.in</span>
            </h3>
            <p className="text-sm text-on-primary-container leading-relaxed">
              O ecossistema digital mais acolhedor das Minas Gerais! Desenvolvido para encurtar caminhos e hospedar suas memórias fotográficas com toda a segurança e charme mineiro.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container-high/10 rounded-full text-xs text-on-primary-container border border-surface-container-high/20 italic font-serif">
              <Coffee className="w-3.5 h-3.5 text-secondary-container animate-pulse" />
              <span>"{randomSaying}"</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4 md:pl-8">
            <h4 className="text-xs font-bold tracking-wider uppercase text-on-primary-container">
              Estações de Parada
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container/80">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white hover:underline transition cursor-pointer text-left"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="hover:text-white hover:underline transition cursor-pointer text-left"
                >
                  Entrar no Painel
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('signup')} 
                  className="hover:text-white hover:underline transition cursor-pointer text-left"
                >
                  Criar uma Conta Nova
                </button>
              </li>
            </ul>
          </div>

          {/* Technology credit & Local Culture */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-on-primary-container">
              Hospitalidade Mineira
            </h4>
            <p className="text-sm text-on-primary-container/80 leading-relaxed">
              Feito com carinho, pão de queijo e café passado na hora para todo o Brasil. Aqui não tem complicação de trem difícil: clicou, encurtou, subiu!
            </p>
            <div className="pt-2 text-xs text-on-primary-container/60">
              <span className="font-mono">Versão 1.0.0 (Mineira) • Estável</span>
            </div>
          </div>

        </div>

        {/* Separator and copyright */}
        <div className="mt-8 pt-8 border-t border-surface-container-high/20 flex flex-col sm:flex-row items-center justify-between text-xs text-on-primary-container/60">
          <p>© {currentYear} Tremz.in. Todos os direitos reservados para Minas Gerais e o mundo.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Desenvolvido com</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" />
            <span>em Belo Horizonte</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
