import { LinkItem, PhotoItem, BrowserStat, OsStat, CountryStat } from './types';

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: '1',
    originalUrl: 'https://exemplo.com/uma-pagina-muito-longa-com-varios-parametros',
    shortUrl: 'tremz.in/cafe123',
    clicks: 452,
    createdAt: '2026-05-12T14:30:00Z',
    trend: 'up'
  },
  {
    id: '2',
    originalUrl: 'https://meusite.com.br/artigo-sobre-pao-de-queijo',
    shortUrl: 'tremz.in/paoque',
    clicks: 89,
    createdAt: '2026-05-10T11:15:00Z',
    trend: 'stable'
  },
  {
    id: '3',
    originalUrl: 'https://loja.com/produto/xicara-barro',
    shortUrl: 'tremz.in/xicara',
    clicks: 12,
    createdAt: '2026-05-05T09:00:00Z',
    trend: 'down'
  }
];

export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    fileName: 'fazenda_ipe.jpg',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOwqI7ReU0yc1sfjRtWvjjK6_6YfnU-xCOodSKUKEasrEPVB6uF0zSfCDNRXcIPOs-P35HP4JHOEgUopVhUT9xG-fsoBNjaY_7jcXaJWNamztM3l5-Q07fEO5RN60sv5GNGVJMwmz1GPoLhgB_sTptvCuMAqJxJ2fLsi6lfb8dLnQvoicotyyiBYo3o360-NqEngTmyngQ39vjIZDtIM4eHlH_W1hQN0M6uJdkDgA5r3Vi64WDqDbwFby5uVJYnkEt223Cu0nqUgKj',
    size: '1.2 MB',
    createdAt: '2026-05-12T14:30:00Z',
    tags: ['minas', 'paisagem', 'trembão'],
    author: 'Zé das Couves'
  },
  {
    id: 'photo-2',
    fileName: 'cafe_da_tarde.png',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2sj1_lxmmF5srQcqReyzNYP566am9BRc6HmYJlGBHOKZkiIFx5_LAsFhs5uthq2jXoSX5WSMrOeVGEk8LnuQidJbymsoKAtmjAtbSz2BgGFUf9T5MKjuuSSbOQIOgLClQ8pSlti4EvJ-gKXirIJaDFzz7uRRz1nqwXl8ueftvRyrItsDjMPRqhhxzNjsucQIt9Y6xrSLn_638TXefeUKypeg6qLw9Y0ONbAYcFgZaEHJRn5dvancCgcRSBqnUVOyv2J32lDeIVE-c',
    size: '850 KB',
    createdAt: '2026-05-10T11:15:00Z',
    tags: ['café', 'colonial', 'uai'],
    author: 'Maria do Café'
  },
  {
    id: 'photo-3',
    fileName: 'janela_colonial.webp',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtONzS8pC-uebn5cpE0KdIEljl2-xEwlwcK_zvRCUc-Lq4rI-DYE273i-QAGeQnBceq9T1c4qMpWWSEjVlVA9U2L9FQouaXsOJ2Jdcja4NHLmIuj9PITD_s2OdKK63Jx4YOKeZ3HiQAAud0nSGxtd9q3Jn_bIzR7dWhcK5W4HkGjd0uUaY_Smqv9bFZhiES12jXBgUpJp0I-AFa_CuWztkYK8ffdULevQhrneogh3T4K3FsdYCy-YnJALpWYM4nafy_OMTdceTOBmB',
    size: '2.1 MB',
    createdAt: '2026-05-08T15:45:00Z',
    tags: ['ouro-preto', 'colonial', 'histórico'],
    author: 'Chico Bento'
  },
  {
    id: 'photo-4',
    fileName: 'quitanda.jpg',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-H2mFC6hYep6kMmm9jvYd1yHACF9ECd6tLELMs-5wgPEOvAmyPK3Jr38OAi8WR-JGZde_wL95L_KceBFU_GNFSYtb_ruwTb28cKNrTO3fCG_bKL7TxTWpJBJZGI_g8QcxWrr5aresG2CzqiN93pUZZxJIJfR9uX9IZc03acruhYF6Wkvzfvem2KPji9Qw61YruQzRL4MbgfxPdV2rmknPF9hSuxBxhJBmNGqu4k8yGL2PBKSulBAbZQJIC8_Wa8X-LqBWdQ6dooxk',
    size: '1.5 MB',
    createdAt: '2026-05-05T09:00:00Z',
    tags: ['pao-de-queijo', 'quitanda', 'receita'],
    author: 'Dona Geralda'
  }
];

export const BROWSER_STATS: BrowserStat[] = [
  { name: 'Chrome', percentage: 60, color: '#904d1e' }, // secondary
  { name: 'Safari', percentage: 25, color: '#a2d2a9' }, // tertiary-fixed-dim
  { name: 'Firefox', percentage: 15, color: '#5d4037' } // primary-container
];

export const OS_STATS: OsStat[] = [
  { name: 'Mobile (iOS/Android)', percentage: 65, color: '#904d1e' },
  { name: 'Windows', percentage: 25, color: '#a2d2a9' },
  { name: 'Mac OS', percentage: 10, color: '#5d4037' }
];

export const COUNTRY_STATS: CountryStat[] = [
  { name: 'Brasil', code: 'BR', flag: '🇧🇷', count: 8450 },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', count: 1204 },
  { name: 'Estados Unidos', code: 'US', flag: '🇺🇸', count: 850 },
  { name: 'Outros', code: 'OTHER', flag: '🌐', count: 1954 }
];

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjaz_JoGJkVpNJCceKoa42IBSYnUPfkZC9zOW5FrBdQ_i9Q3NHI8qda5rKbnCoEvgzr82qW1IENYpqimGmiTHYdvk9dZz4uAQVs-WKqiLVIHNKm_pGcGZbv8-qaqueYFTe6DhsYQ3Fze1V_XhiQ_cEF4SC3LroyWnBBsPP5qR6AnvrQvRYcywdzOR8LnJArtvSanjBcOy6Sq8SvvfTxXcwNfh65RVZWq_ke5biCtdKBAlw0H7fy4I8_rqB2GbW9gzLkAXK04huxKkH';

export const MAP_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo4xUsk-yBB4dqFHOMe8HpwugyO4xOjPmJhT1yjYIfNDuJI246v0d-PdvGTAOU8vOP0C_fIq3Zkl0CBY4lqrJghBizYeDQyJqRWMyh_Sm7av8mJSct8Zc3lon0XeD1CpgABXPNYSSrP7Fg4hwXT--7cjStcoM1R7NB4Ht8YCozYD8hcD0RfaWzrWVf-cvY9A_42RPAjJyhCzYfietYrAdfm8JZZfT9fifIxubyhFg9aG_3JPZNI8bABhqgKlFzmWZortqM6EZHZL7_';
