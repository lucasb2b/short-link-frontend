// src/services/api.ts

import i18next from '../i18n/config';

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
let BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${host}:8080`;

if (BASE_URL.includes('localhost') && host !== 'localhost') {
  BASE_URL = `http://${host}:8080`;
}

export class SessionExpiredError extends Error {
  constructor(message: string = 'Sessão expirada') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('tremz_token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem('tremz_refreshToken');
    if (!refreshToken) {
      window.dispatchEvent(new Event('sessionExpired'));
      throw new SessionExpiredError();
    }

    try {
      const refreshRes = await fetch(`${BASE_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        throw new Error('Refresh failed');
      }

      const data = await refreshRes.json();
      token = data.token;
      localStorage.setItem('tremz_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('tremz_refreshToken', data.refreshToken);
      }

      headers.set('Authorization', `Bearer ${token}`);
      response = await fetch(url, { ...options, headers });
    } catch (e) {
      localStorage.removeItem('tremz_token');
      localStorage.removeItem('tremz_refreshToken');
      window.dispatchEvent(new Event('sessionExpired'));
      throw new SessionExpiredError();
    }
  }

  return response;
}

export async function loginAPI(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Credenciais inválidas');
  }

  return response.json(); // { token, refreshToken }
}

export async function registerAPI(name: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': i18next.language || 'pt-BR'
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Credenciais inválidas');
  }
}

export async function verifyEmailAPI(token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/auth/verify-email?token=${token}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Link inválido ou expirado.');
  }
}

export async function forgotPasswordAPI(email: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/auth/forgot-password?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: {
      'Accept-Language': i18next.language || 'pt-BR'
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao solicitar redefinição.');
  }
}

export async function resetPasswordAPI(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao redefinir a senha.');
  }
}

export async function changePasswordAPI(currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/auth/change-password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao alterar senha.');
  }
}

export async function updateProfileAPI(name: string): Promise<void> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/auth/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao atualizar perfil.');
  }
}

export async function deactivateAccountAPI(): Promise<void> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/auth/deactivate`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao desativar conta.');
  }
}

export async function shortenLinkAPI(originalUrl: string): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao encurtar link.');
  }
  return response.json();
}

export async function getLinkInfoAPI(shortCode: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/links/${shortCode}`);
  if (!response.ok) {
    throw new Error('Link não encontrado ou revogado.');
  }
  return response.json();
}

export async function getUserLinksAPI(page: number = 0): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/links?page=${page}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar links.');
  }
  return response.json();
}

export async function revokeLinkAPI(shortCode: string): Promise<void> {
  const response = await fetchWithAuth(`${BASE_URL}/links/${shortCode}/revoke`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao remover link.');
  }
}

export async function getLinkAnalyticsAPI(shortCode: string): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/links/${shortCode}/analytics`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao carregar métricas.');
  }
  return response.json();
}

export async function uploadImageAPI(file: File, tags: string[] = [], isPrivate: boolean = false): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  if (tags.length > 0) {
    formData.append('tags', tags.join(','));
  }
  formData.append('isPrivate', String(isPrivate));
  const response = await fetchWithAuth(`${BASE_URL}/v1/images`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao enviar imagem.');
  }
  return response.json();
}

export async function getImageDetailsAPI(shortCode: string): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/images/${shortCode}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Imagem não encontrada ou expirou.');
  }
  return response.json();
}

export async function getUserImagesAPI(page: number = 0): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/images?page=${page}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar imagens.');
  }
  return response.json();
}

export async function deleteImageAPI(shortCode: string): Promise<void> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/images/${shortCode}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao deletar imagem.');
  }
}

export async function toggleImageVisibilityAPI(shortCode: string): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/images/${shortCode}/visibility`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao alterar visibilidade.');
  }
  return response.json();
}

export async function getUserStatsAPI(): Promise<any> {
  const response = await fetchWithAuth(`${BASE_URL}/v1/stats/overview`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || 'Erro ao carregar estatísticas.');
  }
  return response.json();
}
