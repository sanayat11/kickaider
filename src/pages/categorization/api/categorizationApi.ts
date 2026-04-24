import { apiFetch } from '@/shared/api/baseApi';

export type WebsiteCategoryApi = 'PRODUCTIVE' | 'NON_PRODUCTIVE' | 'NEUTRAL';

export interface WebsiteItem {
  id: number;
  domain: string;
  defaultCategory: WebsiteCategoryApi;
  effectiveCategory: WebsiteCategoryApi;
  source: 'DEFAULT' | 'OVERRIDE' | string;
  hasOverride: boolean;
  updatedAt?: string;
}

export interface WebsitesApiResponse {
  success?: boolean;
  data?:
    | WebsiteItem[]
    | {
        items?: WebsiteItem[];
        content?: WebsiteItem[];
        websites?: WebsiteItem[];
        total?: number;
        totalElements?: number;
        totalPages?: number;
        size?: number;
        number?: number;
      };
  error?: unknown;
}

export interface OverridePayload {
  websiteId: number;
  category: WebsiteCategoryApi;
}

export interface GetWebsitesParams {
  search?: string;
  overriddenOnly?: boolean;
  uncategorizedOnly?: boolean;
  page?: number;
  size?: number;
}

const buildQueryString = (params: GetWebsitesParams): string => {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (typeof params.overriddenOnly === 'boolean') {
    query.set('overriddenOnly', String(params.overriddenOnly));
  }
  if (typeof params.uncategorizedOnly === 'boolean') {
    query.set('uncategorizedOnly', String(params.uncategorizedOnly));
  }
  if (typeof params.page === 'number') query.set('page', String(params.page));
  if (typeof params.size === 'number') query.set('size', String(params.size));

  const value = query.toString();
  return value ? `?${value}` : '';
};

export const categorizationApi = {
  getWebsites: (params: GetWebsitesParams = {}) =>
    apiFetch<WebsitesApiResponse>(`categories/websites${buildQueryString(params)}`, {
      method: 'GET',
    }),

  getWebsiteByDomain: (domain: string) =>
    apiFetch<{ success?: boolean; data?: WebsiteItem }>(
      `categories/websites/${encodeURIComponent(domain)}`,
      { method: 'GET' },
    ),

  overrideWebsite: (payload: OverridePayload) =>
    apiFetch<{ success?: boolean; data?: WebsiteItem }>('categories/websites/override', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resetWebsite: (websiteId: number) =>
    apiFetch<unknown>(`categories/websites/reset?websiteId=${websiteId}`, { method: 'DELETE' }),

  resetAllWebsites: () =>
    apiFetch<unknown>('categories/websites/reset-all', { method: 'DELETE' }),
};
