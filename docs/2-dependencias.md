# 2. Dependências e Bibliotecas 📦

Todo projeto de ponta precisa de algumas ferramentas já prontas para evitar reinventar a roda. Abaixo detalhamos as bibliotecas (packages) instaladas via `npm` listadas no seu `package.json`, e a razão pela qual foram escolhidas para o Tremz.

## Dependências de Produção (`dependencies`)

São os pacotes necessários para o código da aplicação rodar no navegador do usuário.

### `react` e `react-dom`
- **Por que usamos:** O React é o chassi do nosso trem! É a principal biblioteca para construção de interfaces de usuário (UI) baseada em componentes, criada pelo Facebook. 
- **O que faz:** Permite criar código declarativo que "reage" e atualiza a tela automaticamente quando variáveis de estado (`useState`) mudam. O `react-dom` se encarrega de injetar e manipular isso na página da web (DOM HTML real).

### `lucide-react`
- **Por que usamos:** Ícones bonitos, padronizados e extremamente leves.
- **O que faz:** Provê um conjunto enorme de ícones SVG prontos para uso como componentes React. Exemplo: no código, basta escrever `<Coffee />` que um ícone de xícara de café será desenhado na tela! Muito usado no nosso cabeçalho e modais.

### `motion`
- **Por que usamos:** Animações fluidas e premium.
- **O que faz:** É a biblioteca (antes conhecida como Framer Motion) que cuida das transições, modais surgindo suavemente, ou do movimento fluido entre abas na página. No código, a tag `<motion.div>` é o motorzinho responsável pela mágica visual.

### `@tailwindcss/vite`
- **Por que usamos:** A união do Vite com o TailwindCSS 4 (a nova versão do Tailwind).
- **O que faz:** O Tailwind é a biblioteca que permite estilizar a aplicação apenas colocando nomes de classes diretamente no HTML (ex: `className="bg-primary text-white p-4"`). Esse plugin liga o Tailwind ao bundler do Vite para garantir performance máxima, varrendo o código e compilando apenas o CSS que realmente utilizamos.

### `@google/genai` (Google AI Studio)
- **Por que usamos:** Esse é o "cérebro emprestado" da ferramenta.
- **O que faz:** Um pacote oficial que possibilita chamar os modelos da família Gemini. Embora atualmente no projeto seja mais um legado ou espaço reservado de uso (caso o backend seja acoplado futuramente na mesma base ou se consumirmos uma API diretamente do client-side com chave restrita).

## Dependências de Desenvolvimento (`devDependencies`)

São as ferramentas que ajudam a gente a *escrever* código, mas que não são enviadas para o computador de quem está apenas navegando no site.

### `vite`
- **O que faz:** O nosso "servidor" de desenvolvimento e empacotador (bundler). Em outras palavras, quando rodamos `npm run dev`, é o Vite quem sobe o site no `http://localhost:3000` na velocidade da luz. Quando publicamos para produção (`npm run build`), o Vite comprime os arquivos para ficarem mínimos e ultrarrápidos.

### `typescript`
- **O que faz:** Adiciona os "trilhos" seguros ao JavaScript. Permite declarar quais tipos de dados variáveis devem ter (ex: string, número). Ajuda a pegar erros antes mesmo do código ser executado.

### `tailwindcss` e `autoprefixer`
- **O que faz:** Motores locais de estilização do Tailwind. O Autoprefixer assegura que os estilos compilados vão funcionar mesmo em navegadores levemente mais antigos adicionando prefixos específicos caso necessário.

### `@types/node` e `@types/express`
- **O que faz:** Pacotes de definições de tipos para o TypeScript, permitindo que a IDE saiba quais as funções corretas e parâmetros disponíveis se formos usar algo relacionado ao backend/Node.js nativo.
