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

// ViewType is no longer needed — navigation is handled by React Router paths.
// Routes: / | /login | /signup | /redirecting | /dashboard/links | /dashboard/photos | /dashboard/stats | /dashboard/settings

export interface AnalyticsResponseDTO {
  totalClicks: number;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  deviceTypes: Record<string, number>;
  countries: Record<string, number>;
}
