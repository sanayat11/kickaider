import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IoListOutline,
    IoFileTrayOutline
} from 'react-icons/io5';
import classNames from 'classnames';
import styles from './WorkTimePage.module.scss';
import { Select } from '@/shared/ui/select';
import { FiltersBar } from '@/shared/ui/filters-bar';
import { CheckBox } from '@/shared/ui/checkbox';

interface TableRow {
    id: number;
    employee: string;
    department: string;
    firstActivity: string;
    lastActivity: string;
    timeAtWork: string;
    lateness: number;
    earlyLeave: number;
    productiveTime: string;
    idleTime: string;
    status: 'Normal' | 'Vacation' | 'Sick' | 'Absent' | 'Trip';
    hostname: string;
}

const EMPLOYEES = ['Иван Иванов', 'Петр Петров', 'Анна Сидорова', 'Елена Козлова', 'Дмитрий Волков'];
const DEPARTMENTS = ['IT', 'Sales', 'Marketing', 'HR', 'Support'];

const generateMockData = (): TableRow[] => {
    const statuses: TableRow['status'][] = ['Normal', 'Vacation', 'Sick', 'Absent', 'Trip'];
    return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        employee: EMPLOYEES[Math.floor(Math.random() * EMPLOYEES.length)],
        department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
        firstActivity: '09:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'),
        lastActivity: '18:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'),
        timeAtWork: '8h ' + Math.floor(Math.random() * 60) + 'm',
        lateness: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
        earlyLeave: Math.random() > 0.8 ? Math.floor(Math.random() * 20) : 0,
        productiveTime: '7h ' + Math.floor(Math.random() * 60) + 'm',
        idleTime: Math.floor(Math.random() * 45) + 'm',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        hostname: 'PC-' + Math.floor(1000 + Math.random() * 9000),
    }));
};

const INITIAL_ROWS = generateMockData();

export const WorkTimePage: React.FC = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        period: 'month',
        employee: 'all',
        grouping: 'employee',
        dataFilter: 'all',
        onlyWorkTime: true,
    });
    const [rows] = useState<TableRow[]>(INITIAL_ROWS);
    const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
        'employee', 'department', 'firstActivity', 'lastActivity', 'timeAtWork', 'lateness', 'status'
    ]));
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);


    const handleFilterChange = (name: string, value: string | boolean) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setLoading(true);
        setTimeout(() => setLoading(false), 300);
    };
    const handleSort = (key: keyof TableRow) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedRows = useMemo(() => {
        if (!sortConfig) return rows;
        return [...rows].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [rows, sortConfig]);

    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedRows.slice(start, start + pageSize);
    }, [sortedRows, currentPage, pageSize]);

    const totalPages = Math.ceil(rows.length / pageSize);

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Employee,Department,First,Last,TimeAtWork,Lateness,Status"].join(",") + "\n"
            + rows.map(r => `${r.employee},${r.department},${r.firstActivity},${r.lastActivity},${r.timeAtWork},${r.lateness},${r.status}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "work_time_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleColumn = (col: string) => {
        const next = new Set(visibleColumns);
        if (next.has(col)) next.delete(col);
        else next.add(col);
        setVisibleColumns(next);
    };

    const kpiData = [
        { label: t('reports.workTime.cards.lateness'), value: '12', hint: t('reports.workTime.hints.vsLastWeek', { val: '+2' }) },
        { label: t('reports.workTime.cards.earlyLeaves'), value: '5', hint: t('reports.workTime.hints.withinNorm') },
        { label: t('reports.workTime.cards.timeAtWork'), value: '164:20', hint: t('reports.workTime.hints.avg', { val: '8:05' }) },
        { label: t('reports.workTime.cards.absences'), value: '2', hint: t('reports.workTime.hints.unexcused') },
        { label: t('reports.workTime.cards.trips'), value: '3', hint: '' },
        { label: t('reports.workTime.cards.vacations'), value: '4', hint: '' },
        { label: t('reports.workTime.cards.sickLeaves'), value: '1', hint: '' },
        { label: t('reports.workTime.cards.avgDayDuration'), value: '8:12', hint: '' },
        { label: t('reports.workTime.cards.workDays'), value: '22', hint: t('reports.workTime.hints.fullMonth') },
    ];

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{t('reports.workTime.title')}</h1>
                    <p>{t('reports.workTime.subtitle')}</p>
                </div>
                <button className={styles.exportBtn} onClick={handleExport}>
                    {t('dashboard.common.exportXls')}
                </button>
            </header>

            <FiltersBar
                rightSection={
                    <CheckBox
                        checked={filters.onlyWorkTime}
                        onChange={(e) => handleFilterChange('onlyWorkTime', e.target.checked)}
                        label={t('reports.workTime.filters.onlyWorkTime')}
                    />
                }
            >
                <Select
                    label={t('reports.workTime.filters.period')}
                    value={filters.period}
                    onChange={(val) => handleFilterChange('period', val)}
                    options={[
                        { value: 'day', label: t('dashboard.filters.periods.day') },
                        { value: 'week', label: t('dashboard.filters.periods.week') },
                        { value: 'month', label: t('dashboard.filters.periods.month') },
                        { value: 'custom', label: t('dashboard.filters.periods.custom') },
                    ]}
                />


                <Select
                    label={t('reports.workTime.filters.employee')}
                    value={filters.employee}
                    onChange={(val) => handleFilterChange('employee', val)}
                    options={[
                        { value: 'all', label: t('dashboard.filters.types.all') },
                        ...EMPLOYEES.map(e => ({ value: e, label: e })),
                    ]}
                />

                <Select
                    label={t('reports.workTime.filters.grouping')}
                    value={filters.grouping}
                    onChange={(val) => handleFilterChange('grouping', val)}
                    options={[
                        { value: 'employee', label: t('reports.workTime.filters.byEmployee') },
                        { value: 'department', label: t('reports.workTime.filters.byDepartment') },
                    ]}
                />

                <Select
                    label={t('reports.workTime.filters.filter')}
                    value={filters.dataFilter}
                    onChange={(val) => handleFilterChange('dataFilter', val)}
                    options={[
                        { value: 'all', label: t('reports.workTime.filters.all') },
                        { value: 'lateness', label: t('reports.workTime.filters.withLateness') },
                        { value: 'absences', label: t('reports.workTime.filters.withAbsences') },
                    ]}
                />
            </FiltersBar>

            <section className={styles.kpiGrid}>
                {loading ? Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={classNames(styles.kpiCard, styles.skeleton)} style={{ minHeight: '100px' }} />
                )) : kpiData.map((card, i) => (
                    <div key={i} className={styles.kpiCard}>
                        <span>{card.label}</span>
                        <span className={styles.value}>{card.value}</span>
                        {card.hint && <span className={styles.hint}>{card.hint}</span>}
                    </div>
                ))}
            </section>

            <section className={styles.tableSection}>
                <div className={styles.tableToolbar}>
                    <div className={styles.columnDropdown}>
                        <button
                            className={styles.dropdownBtn}
                            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                        >
                            <IoListOutline /> {t('reports.workTime.table.columns')}
                        </button>
                        {showColumnDropdown && (
                            <div className={styles.dropdownMenu}>
                                {[
                                    { key: 'employee', label: t('reports.workTime.table.employee') },
                                    { key: 'department', label: t('reports.workTime.table.department') },
                                    { key: 'firstActivity', label: t('reports.workTime.table.firstActivity') },
                                    { key: 'lastActivity', label: t('reports.workTime.table.lastActivity') },
                                    { key: 'timeAtWork', label: t('reports.workTime.table.timeAtWork') },
                                    { key: 'lateness', label: t('reports.workTime.table.lateness') },
                                    { key: 'earlyLeave', label: t('reports.workTime.table.earlyLeave') },
                                    { key: 'productiveTime', label: t('reports.workTime.table.productiveTime') },
                                    { key: 'idleTime', label: t('reports.workTime.table.idleTime') },
                                    { key: 'status', label: t('reports.workTime.table.status') },
                                    { key: 'hostname', label: t('reports.workTime.table.hostname') },
                                ].map(col => (
                                    <label key={col.key}>
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.has(col.key)}
                                            onChange={() => toggleColumn(col.key)}
                                        />
                                        <span>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    {loading ? (
                        <div className={classNames(styles.skeleton)} style={{ height: '400px', width: '100%' }} />
                    ) : paginatedRows.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    {visibleColumns.has('employee') && <th onClick={() => handleSort('employee')}>{t('reports.workTime.table.employee')}</th>}
                                    {visibleColumns.has('department') && <th onClick={() => handleSort('department')}>{t('reports.workTime.table.department')}</th>}
                                    {visibleColumns.has('firstActivity') && <th onClick={() => handleSort('firstActivity')}>{t('reports.workTime.table.firstActivity')}</th>}
                                    {visibleColumns.has('lastActivity') && <th onClick={() => handleSort('lastActivity')}>{t('reports.workTime.table.lastActivity')}</th>}
                                    {visibleColumns.has('timeAtWork') && <th onClick={() => handleSort('timeAtWork')}>{t('reports.workTime.table.timeAtWork')}</th>}
                                    {visibleColumns.has('lateness') && <th onClick={() => handleSort('lateness')}>{t('reports.workTime.table.lateness')}</th>}
                                    {visibleColumns.has('earlyLeave') && <th onClick={() => handleSort('earlyLeave')}>{t('reports.workTime.table.earlyLeave')}</th>}
                                    {visibleColumns.has('productiveTime') && <th onClick={() => handleSort('productiveTime')}>{t('reports.workTime.table.productiveTime')}</th>}
                                    {visibleColumns.has('idleTime') && <th onClick={() => handleSort('idleTime')}>{t('reports.workTime.table.idleTime')}</th>}
                                    {visibleColumns.has('status') && <th onClick={() => handleSort('status')}>{t('reports.workTime.table.status')}</th>}
                                    {visibleColumns.has('hostname') && <th onClick={() => handleSort('hostname')}>{t('reports.workTime.table.hostname')}</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRows.map(row => (
                                    <tr key={row.id}>
                                        {visibleColumns.has('employee') && <td>{row.employee}</td>}
                                        {visibleColumns.has('department') && <td>{row.department}</td>}
                                        {visibleColumns.has('firstActivity') && <td>{row.firstActivity}</td>}
                                        {visibleColumns.has('lastActivity') && <td>{row.lastActivity}</td>}
                                        {visibleColumns.has('timeAtWork') && <td>{row.timeAtWork}</td>}
                                        {visibleColumns.has('lateness') && <td>{row.lateness > 0 ? `${row.lateness} ${t('dashboard.common.minutesShort')}` : '-'}</td>}
                                        {visibleColumns.has('earlyLeave') && <td>{row.earlyLeave > 0 ? `${row.earlyLeave} ${t('dashboard.common.minutesShort')}` : '-'}</td>}
                                        {visibleColumns.has('productiveTime') && <td>{row.productiveTime}</td>}
                                        {visibleColumns.has('idleTime') && <td>{row.idleTime}</td>}
                                        {visibleColumns.has('status') && (
                                            <td>
                                                <span className={classNames(styles.statusTag, styles[row.status.toLowerCase()])}>
                                                    {t(`reports.workTime.status.${row.status.toLowerCase()}`)}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.has('hostname') && <td>{row.hostname}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyState}>
                            <IoFileTrayOutline />
                            <p>{t('dashboard.common.noData')}</p>
                        </div>
                    )}
                </div>

                <div className={styles.pagination}>
                    <div className={styles.pageSize}>
                        <span>{t('dashboard.common.show')}:</span>
                        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className={styles.pages}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={classNames({ [styles.active]: currentPage === i + 1 })}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
