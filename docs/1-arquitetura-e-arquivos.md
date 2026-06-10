# 1. Arquitetura e Arquivos 📁

Esta seção da documentação tem como objetivo desmistificar a estrutura de diretórios e o propósito de cada arquivo no nosso projeto Frontend, o Tremz! Aqui, a gente não deixa nenhum trem sem explicação.

## 🗂️ Estrutura de Diretórios

O projeto foi inicializado utilizando o **Vite** como empacotador (bundler) e a estrutura base é dividida nas seguintes pastas e arquivos principais na raiz:

- `package.json` / `package-lock.json`: Arquivos que gerenciam as dependências e scripts do Node.js (detalharemos as dependências no documento 2).
- `vite.config.ts`: Configuração do bundler Vite, como as definições de compilação, plugins do React e TailwindCSS.
- `tsconfig.json`: Configurações de tipagem e compilação do TypeScript.
- `index.html`: O ponto de entrada principal do HTML no navegador.
- `assets/`: Arquivos estáticos (ícones, configurações do AI Studio, imagens brutas) que não passam pelo empacotador do Vite.
- `src/`: O "coração" do projeto! Tudo o que é código, componente e regra de negócio mora aqui dentro.

---

## 💻 Arquivos Principais dentro do `src/`

Aqui mora a lógica e as definições globais do nosso projeto.

### `main.tsx`
O ponto de montagem do React. Ele busca a div com id `root` no `index.html` e "injeta" a aplicação React (que é o arquivo `App.tsx`) lá dentro. É a ponte entre o HTML estático e o JavaScript dinâmico.

### `App.tsx`
A locomotiva principal! É o componente raiz que gerencia os estados globais mais importantes: 
- Quais links o usuário criou.
- Quais fotos o usuário subiu.
- Quem é o usuário logado no momento (`currentUser`).
- Qual é a página/tela atual sendo exibida (`currentView`).

### `index.css`
Nosso arquivo de estilos globais. Além das chamadas para o TailwindCSS (`@import "tailwindcss";`), ele contém algumas variáveis de cor customizadas (padrão Material Design 3) inseridas nas classes `:root`.

### `types.ts`
Como usamos TypeScript para não deixar nenhum tipo de dado escapar dos trilhos, este arquivo centraliza todas as **Interfaces** e **Types** do sistema. Por exemplo, a estrutura do que é um `LinkItem` ou `PhotoItem` fica definida aqui para uso em todo o projeto.

### `data.ts`
Arquivo de mock (dados falsos)! Ele carrega os links (`INITIAL_LINKS`) e fotos (`INITIAL_PHOTOS`) simulados para que o projeto tenha conteúdo visual sem precisar de um banco de dados real rodando no começo.

---

## 🧩 Os Componentes em `src/components/`

Os componentes são os "vagões" que, quando encaixados, formam o trem todo da interface. A aplicação Tremz utiliza a arquitetura baseada em componentes do React. Abaixo a explicação do que cada um faz:

#### Navegação e Base
- **`Header.tsx`**: A barra de navegação no topo (Header). Possui lógica para mudar visualmente de acordo com a tela atual (ex: botão de Sair da Estação).
- **`Footer.tsx`**: O rodapé bonitinho da aplicação com links falsos, direitos autorais e seções auxiliares.

#### Funcionalidades Principais (Home)
- **`LinkShortener.tsx`**: Componente onde fica o campo de texto grande para colar um link e o botão de encurtar. Ele apenas chama uma função enviando a URL que o usuário colou.
- **`PhotoUploader.tsx`**: A área onde o usuário pode fazer upload de uma imagem ou colar a URL de uma. Possui a lógica do formulário de upload.
- **`PublicGallery.tsx`**: A galeria tipo "mural" na página inicial que mostra as fotos públicas cadastradas por outras pessoas (ou mockadas pelo `data.ts`).

#### Painel do Usuário (Dashboard) e Telas Secundárias
- **`StatsPanel.tsx`**: Painel que exibe gráficos falsos e métricas resumidas (quantos cliques, navegadores, etc).
- **`SettingsPanel.tsx`**: O painel onde o usuário logado pode alterar o próprio nome, atualizar senha e trocar a foto de perfil.
- **`RedirectScreen.tsx`**: A tela animada que aparece com um "cronômetro" carregando antes de simular o redirecionamento quando você clica em um link curto.

#### Modais (Janelas Pop-up)
- **`PhotoDetail.tsx`** e **`PhotoDetailModal.tsx`**: A tela cheia (ou modal) que se abre quando o usuário clica em uma foto na galeria, mostrando a imagem grande, o autor e as tags.
- **`LinkStatsModal.tsx`**: A janelinha de estatísticas específicas que abre quando você quer inspecionar um link individualmente no seu painel.

#### Outros
- **`LoadingSpinner.tsx`**: Aquela pequena animação que gira indicando que algo está sendo carregado.

> [!TIP]
> Todos os arquivos tentam seguir o princípio da responsabilidade única. O `App.tsx` guarda as variáveis e a memória, e apenas passa essas variáveis para os componentes desenharem a tela!
