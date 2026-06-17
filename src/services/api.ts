// src/services/api.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── Função de login ───────────────────────────────────────────────────────
export async function loginAPI(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Tenta extrair a mensagem de erro do corpo, se houver
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.message || errorData?.error || 'Credenciais inválidas';
    throw new Error(message);
  }

  // Exemplo de resposta: { token: "eyJ..." }
  const data = await response.json();
  return data.token as string;
}

// Função para cadastrar um usuário
export async function registerAPI(name: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    // Tenta extrair a mensagem de erro do corpo, se houver
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.message || errorData?.error || 'Credenciais inválidas';
    throw new Error(message);
  }

  return;
}