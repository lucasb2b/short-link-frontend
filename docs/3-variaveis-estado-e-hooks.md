# 3. Variáveis de Estado e Hooks 🎣

Nesta documentação, abordamos como o coração do aplicativo se comporta e onde a memória dele mora. No ambiente React, usamos **Hooks** — literalmente "ganchos" — para fisgar e atualizar valores sem precisar recarregar a página da web inteira. 

Todo o grosso da nossa memória principal (Estado Global) mora no arquivo `src/App.tsx`.

## Hooks do React Utilizados

### 1. `useState` (A memória de curto prazo)
O Hook `useState` é o mecanismo que avisa ao React: *"Ei, quando essa variável mudar, redesenhe a tela!"*

Ele nos entrega dois itens: a **variável em si** e a **função para atualizar** essa variável.
*Exemplo prático:* `const [links, setLinks] = useState([...])`

### 2. `useEffect` (Os "Ouvintes" / Reflexos)
O `useEffect` serve para reagir a efeitos colaterais (algo que muda independentemente da tela, tipo o carregamento do código inicial, uma chamada de API, ou para salvar algo na memória quando um dado for atualizado). 

---

## 🗄️ As Variáveis Globais (Estado Principal) em `App.tsx`

Como não temos Redux ou ContextAPI ativados nesse momento, quase todas as variáveis globais residem no pai-de-todos, o componente `App`.

### `links` e `setLinks`
- **O que faz:** Guarda a lista (Array) de todos os links que o usuário encurtou. 
- **Persistência:** Ele busca os dados de `localStorage.getItem('tremz_links')`. Se não achar, puxa os links falsos (INITIAL_LINKS).

### `photos` e `setPhotos`
- **O que faz:** Guarda a lista de todas as fotos armazenadas na nossa galeria.
- **Persistência:** Salva no `localStorage.getItem('tremz_photos')`.

### `currentUser` e `setCurrentUser`
- **O que faz:** Guarda os dados do mineiro logado na sessão ativa! Se for `null`, o usuário está deslogado e o Header mostrará os botões "Entrar" e "Cadastrar".
- **Persistência:** O `useEffect` monitora sempre que essa variável é atualizada, e espelha no localStorage (`tremz_user`), fazendo com que, se recarregarmos a página, a gente continue conectado.

### `registeredUsers` e `setRegisteredUsers`
- **O que faz:** Simula de forma fajuta o banco de dados do Backend para o sistema de autenticação, armazenando todo mundo que "criou uma conta".

### `currentView` e `setCurrentView`
- **O que faz:** É a nossa "Bússola de Rotas" interna. Como não usamos bibliotecas como o React Router, nós fazemos um roteamento condicional local: se `currentView === 'home'`, mostramos o hero principal; se `currentView === 'dashboard-links'`, mostramos o painel administrativo. 

## A Mágica da Sincronização LocalStorage

Observe os seguintes blocos espalhados no nosso App:

```typescript
useEffect(() => {
  localStorage.setItem('tremz_links', JSON.stringify(links));
}, [links]);
```

**O que isso significa?** 
A array final do hook (`[links]`) avisa o react: *"Fique vigiando essa variável específica"*. 
Toda vez que uma função chamar um `setLinks(novoLink)`, a variável altera. O react então redesenha a tela na hora com o novo item e logo em seguida o `useEffect` dispara automaticamente atualizando a gaveta permanente (`localStorage`) do seu navegador!

Isso confere o aspecto "mágico" e imediato da interface.
