export interface LinkItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface PhotoItem {
  id: string;
  fileName: string;
  imageUrl: string;
  size: string;
  createdAt: string;
  tags: string[];
  author: string;
  isPrivate?: boolean;
}

export interface BrowserStat {
  name: string;
  percentage: number;
  color: string;
}

export interface OsStat {
  name: string;
  percentage: number;
  color: string;
}

export interface CountryStat {
  name: string;
  code: string;
  flag: string;
  count: number;
}

export type ViewType =
  | 'home'
  | 'login'
  | 'signup'
  | 'redirecting'
  | 'dashboard-links'
  | 'dashboard-photos'
  | 'dashboard-stats'
  | 'dashboard-settings'
  | 'photo-detail';
