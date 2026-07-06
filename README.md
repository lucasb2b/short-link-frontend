<div align="center">
  <img alt="Tremz.in Logo" src="public/favicon.svg" width="100" />
  <h1>Tremz.in — Frontend App</h1>
  <p><strong>A Modern, High-Performance Link Shortener & Image Hosting Platform</strong></p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=for-the-badge" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white&style=for-the-badge" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  </p>
</div>

---

## 📌 Sobre o Projeto

O **Tremz.in** é uma plataforma inovadora desenvolvida para gerenciar links curtos e hospedagem segura de imagens. Esta interface (Frontend) foi construída com foco absoluto em **Experiência do Usuário (UX)**, **Performance** e **Design Responsivo**.

Seja você um usuário casual querendo encurtar a URL do seu perfil, ou um profissional analisando estatísticas de cliques em tempo real, o painel interativo do Tremz atende à demanda com animações fluidas e uma interface *premium*.

## ✨ Funcionalidades em Destaque

*   🔗 **Encurtador de Links Instantâneo**: Transforme URLs longas em links memoráveis com apenas um clique.
*   📸 **Hospedagem de Imagens (Públicas e Privadas)**: Faça uploads rápidos. Usuários podem escolher deixar a imagem listada publicamente ou mantê-la privada (acessível apenas por quem possui o link).
*   📊 **Dashboard de Analytics Real-Time**: Painel intuitivo com gráficos e métricas de desempenho dos seus links e imagens.
*   🛡️ **Gestão de Sessão**: Autenticação segura usando JWT (JSON Web Tokens) persistida no lado do cliente.
*   ⚡ **Performance Extrema**: O estado global da aplicação foi projetado usando **Hooks Modulares** e *Context API* dividida (Auth, Links e Photos), o que previne re-renderizações desnecessárias da árvore do DOM.

## 🛠️ Tecnologias Utilizadas

A arquitetura do front-end foi pensada para escalar, mantendo um código limpo e de fácil manutenção:

*   **React 18 & Vite**: Para um ambiente de desenvolvimento ultra-rápido e <i>builds</i> otimizados.
*   **TypeScript**: Tipagem estática rigorosa para garantir a segurança da comunicação com os DTOs do backend.
*   **TailwindCSS**: Estilização moderna através de classes utilitárias, permitindo a construção rápida de componentes responsivos e "Dark Mode" elegante.
*   **Framer Motion**: Responsável por trazer a aplicação à vida através de animações fluídas (<i>micro-interactions</i>) que não impactam o <i>frame rate</i>.
*   **Lucide React**: Biblioteca de ícones vetoriais modernos e consistentes.

## 🚀 Como Executar Localmente

### Pré-requisitos
*   Node.js (versão 18+)
*   NPM ou Yarn

### Passos

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/shortlink-frontend.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd shortlink-frontend
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente baseando-se no arquivo de exemplo (se existir) ou apenas aponte para o backend local (porta 8080).

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Acesse no seu navegador: `http://localhost:3000`

---

## 👨‍💻 Arquitetura e Decisões de Design (Para Recrutadores)

Este projeto demonstra conhecimentos sólidos em engenharia de front-end. Durante o desenvolvimento, o maior desafio de design pattern superado foi a refatoração do *Context API*. Inicialmente construído como um *God Object* (um único contexto gerindo Links, Fotos e Autenticação), a arquitetura foi desmembrada em contextos menores (`useAuth`, `useLinks`, `usePhotos`). Isso aumentou drasticamente a performance de renderização no painel de estatísticas, já que componentes de links não são mais afetados quando o estado das imagens sofre alterações.

---

<p align="center">Desenvolvido com 🩵 por Lucas Brito.</p>
