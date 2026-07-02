// src/services/api.ts

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
let BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${host}:8080`;

// Workaround: If .env forces localhost but we are accessing via IP (smartphone), force the IP.
if (BASE_URL.includes('localhost') && host !== 'localhost') {
  BASE_URL = `http://${host}:8080`;
}

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

export async function verifyEmailAPI(token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/auth/verify-email?token=${token}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Link inválido ou expirado.';
    throw new Error(message);
  }
}

export async function forgotPasswordAPI(email: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/auth/forgot-password?email=${encodeURIComponent(email)}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao solicitar redefinição de senha.';
    throw new Error(message);
  }
}

export async function resetPasswordAPI(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao redefinir a senha.';
    throw new Error(message);
  }
}

export async function changePasswordAPI(currentPassword: string, newPassword: string): Promise<void> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/v1/auth/change-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao alterar senha.';
    throw new Error(message);
  }
}

export async function updateProfileAPI(name: string): Promise<void> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/v1/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao atualizar perfil.';
    throw new Error(message);
  }
}

export async function deactivateAccountAPI(): Promise<void> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/v1/auth/deactivate`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao desativar conta.';
    throw new Error(message);
  }
}

// ─── Função para encurtar link (autenticada) ──────────────────────────
export async function shortenLinkAPI(originalUrl: string): Promise<{
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
}> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao encurtar link.';
    throw new Error(message);
  }

  return response.json(); // { originalUrl, shortUrl, shortCode }
}

// ─── Função para obter detalhes de um link público ────────────────────
export async function getLinkInfoAPI(shortCode: string): Promise<{
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
}> {
  const response = await fetch(`${BASE_URL}/links/${shortCode}`);
  if (!response.ok) {
    throw new Error('Link não encontrado ou revogado.');
  }
  return response.json();
}

export async function getUserLinksAPI(page: number = 0): Promise<{
  content: Array<{
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
  }>;
  // outros campos da Page do Spring, se necessário
}> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/links?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar links.');
  }

  return response.json();
}

export async function revokeLinkAPI(shortCode: string): Promise<void> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/links/${shortCode}/revoke`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao remover link.';
    throw new Error(message);
  }
}

export async function getLinkAnalyticsAPI(shortCode: string): Promise<any> {
  const token = localStorage.getItem('tremz_token');
  const response = await fetch(`${BASE_URL}/links/${shortCode}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || errorData?.error || 'Erro ao carregar métricas.';
    throw new Error(message);
  }

  return response.json();
}