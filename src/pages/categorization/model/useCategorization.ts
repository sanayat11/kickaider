import { useState, useEffect, useCallback } from 'react';
import { categorizationApi, type WebsiteCategoryApi, type WebsiteItem } from '../api/categorizationApi';
import type { CategorizationRow, Category } from './types';

export type FilterType = 'all' | 'uncategorized' | 'manual';

const API_TO_CATEGORY: Record<string, Category> = {
  PRODUCTIVE: 'productive',
  NON_PRODUCTIVE: 'unproductive',
  NEUTRAL: 'neutral',
};

const CATEGORY_TO_API: Record<Category, WebsiteCategoryApi> = {
  productive: 'PRODUCTIVE',
  unproductive: 'NON_PRODUCTIVE',
  neutral: 'NEUTRAL',
  uncategorized: 'NEUTRAL',
};

interface ExtractedWebsites {
  items: WebsiteItem[];
  total: number | null;
  totalPages: number | null;
}

const toNumber = (value: unknown): number | null => {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return value;
};

const extractWebsites = (res: unknown): ExtractedWebsites => {
  if (Array.isArray(res)) {
    return { items: res as WebsiteItem[], total: res.length, totalPages: null };
  }

  if (!res || typeof res !== 'object') {
    return { items: [], total: null, totalPages: null };
  }

  const root = res as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(data)) {
    return { items: data as WebsiteItem[], total: data.length, totalPages: null };
  }

  const container =
    data && typeof data === 'object' ? (data as Record<string, unknown>) : root;

  const items = (
    Array.isArray(container.items)
      ? container.items
      : Array.isArray(container.content)
        ? container.content
        : Array.isArray(container.websites)
          ? container.websites
          : []
  ) as WebsiteItem[];

  const total = toNumber(container.totalElements) ?? toNumber(container.total) ?? items.length;
  const totalPages = toNumber(container.totalPages);

  return { items, total, totalPages };
};

const extractWebsite = (res: unknown): WebsiteItem | null => {
  if (!res || typeof res !== 'object') return null;
  const root = res as Record<string, unknown>;
  const data = root.data;

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as WebsiteItem;
  }
  if (root && typeof root === 'object' && 'id' in root) {
    return root as unknown as WebsiteItem;
  }

  return null;
};

const toRow = (item: WebsiteItem): CategorizationRow => ({
  id: item.domain,
  websiteId: item.id,
  name: item.domain,
  type: 'web',
  category: API_TO_CATEGORY[item.effectiveCategory] ?? 'uncategorized',
  source: item.hasOverride || item.source === 'OVERRIDE' ? 'manual' : 'hardcoded',
  updatedAt: item.updatedAt,
});

export const useCategorization = () => {
  const [rows, setRows] = useState<CategorizationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categorizationApi.getWebsites({
        search: search || undefined,
        overriddenOnly: filter === 'manual' ? true : undefined,
        uncategorizedOnly: filter === 'uncategorized' ? true : undefined,
        page: page - 1,
        size: pageSize,
      });

      const extracted = extractWebsites(res);
      const mappedRows = extracted.items.map(toRow);
      const nextTotalCount = extracted.total ?? mappedRows.length;
      const nextTotalPages =
        extracted.totalPages ?? Math.max(1, Math.ceil(nextTotalCount / pageSize));

      setRows(mappedRows);
      setTotalCount(nextTotalCount);
      setTotalPages(nextTotalPages);
    } catch (err) {
      console.error('[useCategorization] loadData error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filter, page, pageSize]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const setSearchWithPageReset = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const setFilterWithPageReset = (value: FilterType) => {
    setPage(1);
    setFilter(value);
  };

  const handleCategoryChange = async (id: string, category: Category) => {
    setUpdatingIds((prev) => [...prev, id]);
    try {
      const row = rows.find((r) => r.id === id);
      if (!row) return;

      await categorizationApi.overrideWebsite({
        websiteId: row.websiteId,
        category: CATEGORY_TO_API[category],
      });
      await loadData();
    } catch (err) {
      console.error('[useCategorization] handleCategoryChange error:', err);
      alert('Failed to update category');
    } finally {
      setUpdatingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleReset = async (id: string) => {
    setUpdatingIds((prev) => [...prev, id]);
    try {
      const row = rows.find((r) => r.id === id);
      if (!row) return;

      await categorizationApi.resetWebsite(row.websiteId);
      await loadData();
    } catch (err) {
      console.error('[useCategorization] handleReset error:', err);
      alert('Failed to reset category');
    } finally {
      setUpdatingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleResetAll = async () => {
    setLoading(true);
    try {
      await categorizationApi.resetAllWebsites();
      await loadData();
    } catch (err) {
      console.error('[useCategorization] handleResetAll error:', err);
      alert('Failed to reset all categories');
      setLoading(false);
    }
  };

  const handleCreate = async (domain: string, category: Category) => {
    const normalizedDomain = domain.trim();
    if (!normalizedDomain) throw new Error('Domain is required');

    const websiteRes = await categorizationApi.getWebsiteByDomain(normalizedDomain);
    const website = extractWebsite(websiteRes);
    if (!website) throw new Error('Website not found');

    await categorizationApi.overrideWebsite({
      websiteId: website.id,
      category: CATEGORY_TO_API[category],
    });
    await loadData();
  };

  return {
    rows,
    totalCount,
    totalPages,
    page,
    pageSize,
    loading,
    search,
    filter,
    updatingIds,
    setPage,
    setPageSize,
    setSearch: setSearchWithPageReset,
    setFilter: setFilterWithPageReset,
    handleCategoryChange,
    handleReset,
    handleResetAll,
    handleCreate,
    refresh: loadData,
  };
};
