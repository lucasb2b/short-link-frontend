# 4. Integração com Backend (APIs) 🔌

O Tremz atual é maravilhoso, mas para levar isso a público, precisamos ligá-lo a um servidor real (Backend) e a um banco de dados de verdade, abandonando a simulação do `localStorage`. 

Abaixo listamos os arquivos e as funções exatas onde você **deve** realizar essas modificações consumindo chamadas HTTP, como `fetch()` nativo ou instalando a biblioteca `axios`.

## 1. Carregamento Inicial de Dados
Hoje a nossa aplicação carrega variáveis em `src/App.tsx` assim que inicia utilizando dados estáticos do arquivo `data.ts`.

**Onde mudar:** Substitua as inicializações do `useState` no topo do `App.tsx` para usar o `useEffect` efetuando o `GET` da API no momento em que o componente monta:

*Exemplo de Substituição em `App.tsx`:*
```typescript
const [links, setLinks] = useState<LinkItem[]>([]); // Inicia vazio

useEffect(() => {
  // Dispara uma vez que a página carrega
  async function fetchLinks() {
    try {
      const response = await fetch('https://Sua-API-Tremz.com/api/links', {
        headers: { 'Authorization': `Bearer ${currentUser.token}` } // Se autenticado
      });
      const data = await response.json();
      setLinks(data);
    } catch(err) {
      console.error("Ô trem difícil, falhou ao puxar dados", err);
    }
  }
  fetchLinks();
}, []); // O array vazio assegura que só puxe uma vez ao carregar a home.
```

*(Faça isso de maneira análoga para as Fotos)*

---

## 2. Encurtando um Link (POST)
Atualmente a função simulada é a `handleShortenLink` dentro de `src/App.tsx` por volta da linha 158.

**O que fazer:** Ao invés de gerar um ID aleatório com `Math.random()`, precisamos pedir pra API oficial fazer o encurtamento no servidor e gravar no BD.

*Como vai ficar:*
```typescript
const handleShortenLink = async (originalUrl: string): Promise<LinkItem> => {
  const response = await fetch('https://Sua-API-Tremz.com/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: originalUrl })
  });
  
  const newLink = await response.json(); 
  // O backend responde com o ID e URL encurtada reais
  setLinks((prev) => [newLink, ...prev]);
  showToast('Trem encurtado com sucesso na base de dados, uai!');
  return newLink;
};
```

---

## 3. Sistema de Login e Autenticação
O `App.tsx` possui `handleLogin` e `handleSignup`. Atualmente, ambos varrem um array em memória que finge ser um banco.

**Como integrar JWT (Token):**
1. Na função `handleLogin`, faça um POST para o Endpoint do backend: `/api/auth/login` enviando `loginEmail` e `loginPass`.
2. Se o retorno for sucesso (200 OK), a API do backend vai te retornar um Token (JWT).
3. Você vai salvar esse Token de verdade usando o localStorage: `localStorage.setItem('auth_token', responseData.token)`.
4. Com isso, todo os requests futuros listados acima (como puxar as fotos e links *privados* do mineiro) usarão esse token no `Header Authorization`.

---

## 4. O Sistema de Imagens
Hoje a imagem é carregada de um URL público mockado ou do bucket base local simulado no `PhotoUploader.tsx`.

Para o backend real:
1. No Frontend (`handleUploadPhoto`), faça upload do arquivo via formato `FormData` para bater numa API que suporta `multipart/form-data`.
2. O Backend irá processar a imagem, subir para um serviço em nuvem (ex: Amazon S3 ou Google Cloud Storage) e devolver o URL permanente da imagem armazenada no servidor.
3. Você salva o link permanente devolvido no array `photos`.

## Dica de Ouro
Antes de sair mexendo diretamente no `App.tsx` engordando o arquivo, recomendo criar uma nova pasta `src/services/` e construir um arquivo `api.ts`. Centralize lá todas as configurações do `fetch` ou `Axios`, e no `App.tsx` apenas invoque funções assíncronas simples como `await api.shortenUrl(minhaUrl)` para manter o painel da locomotiva limpo e os motores organizados.
