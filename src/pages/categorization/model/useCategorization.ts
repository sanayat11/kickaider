import { useState, useEffect, useMemo, useCallback } from 'react';
import { categorizationMockApi } from '@/shared/api/mock/categorization.mock';
import type { CategorizationRow, Category } from '@/shared/api/mock/categorization.mock';

export type FilterType = 'all' | 'uncategorized' | 'manual';

export const useCategorization = () => {
    const [rows, setRows] = useState<CategorizationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [updatingIds, setUpdatingIds] = useState<string[]>([]);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await categorizationMockApi.getCategorizationList({ search, filter });
            setRows(data);
            setPage(1); // Reset to first page on search/filter change
        } catch (err) {
            console.error('Failed to load categorization data:', err);
        } finally {
            setLoading(false);
        }
    }, [search, filter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCategoryChange = async (id: string, category: Category) => {
        setUpdatingIds(prev => [...prev, id]);
        try {
            const updated = await categorizationMockApi.setCategory(id, category);
            setRows(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err) {
            console.error('Failed to update category:', err);
        } finally {
            setUpdatingIds(prev => prev.filter(x => x !== id));
        }
    };

    const handleReset = async (id: string) => {
        setUpdatingIds(prev => [...prev, id]);
        try {
            const updated = await categorizationMockApi.resetToDefault(id);
            setRows(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err) {
            console.error('Failed to reset entry:', err);
        } finally {
            setUpdatingIds(prev => prev.filter(x => x !== id));
        }
    };

    const handleResetAll = async () => {
        setLoading(true);
        try {
            await categorizationMockApi.resetAllManual();
            await loadData();
        } catch (err) {
            console.error('Failed to reset all rules:', err);
            setLoading(false);
        }
    };

    // Client-side pagination logic
    const totalCount = rows.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginatedRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return rows.slice(start, start + pageSize);
    }, [rows, page, pageSize]);

    return {
        rows: paginatedRows,
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
        setSearch,
        setFilter,
        handleCategoryChange,
        handleReset,
        handleResetAll,
        refresh: loadData,
    };
};
