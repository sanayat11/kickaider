import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronBackOutline, IoChevronForwardOutline, IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/shared/constants/constants';
import styles from './EmployeeRatingPage.module.scss';
import classNames from 'classnames';

type Criterion = 'productive' | 'unproductive' | 'neutral' | 'idle';

// Base Mock Data
const BASE_EMPLOYEES = [
    { id: '1', name: 'Иванов Иван Иванович', initials: 'ИИ', hostname: 'DESKTOP-1AB2C3D', department: 'IT', bProd: 435, bUnp: 15, bNeu: 45, bIdle: 120 }, // mostly minutes
    { id: '2', name: 'Смирнова Анна Сергеевна', initials: 'СА', hostname: 'LAPTOP-XYZ123', department: 'HR', bProd: 410, bUnp: 20, bNeu: 50, bIdle: 60 },
    { id: '3', name: 'Петров Петр Петрович', initials: 'ПП', hostname: 'DESKTOP-8K9L0M', department: 'Marketing', bProd: 380, bUnp: 45, bNeu: 30, bIdle: 150 },
    { id: '4', name: 'Сауле Абдыкадырова Sakewa', initials: 'СА', hostname: 'MACBOOK-PRO-14', department: 'IT', bProd: 345, bUnp: 30, bNeu: 110, bIdle: 85 },
    { id: '5', name: 'Кузнецов Алексей', initials: 'КА', hostname: 'DESKTOP-QWERTY', department: 'Sales', bProd: 310, bUnp: 60, bNeu: 25, bIdle: 195 },
    { id: '6', name: 'Васильева Елена', initials: 'ВЕ', hostname: 'LAPTOP-ABCDEF', department: 'Finance', bProd: 270, bUnp: 80, bNeu: 40, bIdle: 200 },
    { id: '7', name: 'Дмитрий Соколов', initials: 'ДС', hostname: 'DESKTOP-55XX2Q', department: 'Sales', bProd: 220, bUnp: 120, bNeu: 60, bIdle: 210 },
    { id: '8', name: 'Ольга Николаева', initials: 'ОН', hostname: 'MAC-MINI-01', department: 'HR', bProd: 395, bUnp: 10, bNeu: 35, bIdle: 90 },
    { id: '9', name: 'Максим Лебедев', initials: 'МЛ', hostname: 'LAPTOP-GHJ789', department: 'IT', bProd: 440, bUnp: 5, bNeu: 55, bIdle: 40 },
    { id: '10', name: 'Татьяна Морозова', initials: 'ТМ', hostname: 'DESKTOP-ZAQ123', department: 'Marketing', bProd: 320, bUnp: 50, bNeu: 80, bIdle: 130 },
    { id: '11', name: 'Роман Никитин', initials: 'РН', hostname: 'DESKTOP-WSX456', department: 'Finance', bProd: 290, bUnp: 65, bNeu: 70, bIdle: 160 },
    { id: '12', name: 'Юлия Волкова', initials: 'ЮВ', hostname: 'LAPTOP-EDC789', department: 'Marketing', bProd: 355, bUnp: 25, bNeu: 45, bIdle: 100 },
];

const criterionColors: Record<Criterion, string> = {
    productive: '#2ebd59',
    unproductive: '#ef4444',
    neutral: '#3b82f6',
    idle: '#f59e0b'
};

export const EmployeeRatingPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const formatMinutes = (m: number) => {
        const hours = Math.floor(m / 60);
        const mins = m % 60;
        return `${hours.toString().padStart(2, '0')}${t('dashboard.common.hoursShort')} ${mins.toString().padStart(2, '0')}${t('dashboard.common.minutesShort')}`;
    };

    const criterionLabels: Record<Criterion, string> = {
        productive: t('reports.rating.criterions.productive'),
        unproductive: t('reports.rating.criterions.unproductive'),
        neutral: t('reports.rating.criterions.neutral'),
        idle: t('reports.rating.criterions.idle')
    };
    const [currentDate, setCurrentDate] = useState('2026-02-22');

    // Filters state
    const [department, setDepartment] = useState('all');
    const [criterion, setCriterion] = useState<Criterion>('productive');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        setCurrentDate(date.toISOString().split('T')[0]);
        setCurrentPage(1); // Reset to first page
    };

    const handleNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        setCurrentDate(date.toISOString().split('T')[0]);
        setCurrentPage(1); // Reset to first page
    };

    const handleOpenDetails = () => {
        navigate(paths.DASHBOARD_DAY_DETAILS);
    };

    // Calculate dynamic data based on filters
    const processedData = useMemo(() => {
        // Pseudo-random modifier based on date
        const dateValue = new Date(currentDate).getTime();
        const dateMod = Math.abs((dateValue % 100) - 50) / 50; // value between 0 and 1

        let filtered = BASE_EMPLOYEES.map(emp => {
            // Apply slight variations so different days look different
            const prod = Math.max(0, Math.floor(emp.bProd * (1 + (dateMod * 0.2 - 0.1))));
            const unprod = Math.max(0, Math.floor(emp.bUnp * (1 + (dateMod * 0.3 - 0.15))));
            const neu = Math.max(0, Math.floor(emp.bNeu * (1 + (dateMod * 0.2 - 0.1))));
            const idl = Math.max(0, Math.floor(emp.bIdle * (1 + (dateMod * 0.4 - 0.2))));

            return {
                id: emp.id,
                name: emp.name,
                initials: emp.initials,
                hostname: emp.hostname,
                department: emp.department,
                productive: prod,
                unproductive: unprod,
                neutral: neu,
                idle: idl
            };
        });

        if (department !== 'all') {
            filtered = filtered.filter(e => e.department === department);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.name.toLowerCase().includes(query) ||
                e.hostname.toLowerCase().includes(query)
            );
        }

        // Sort by the chosen criterion descending
        filtered.sort((a, b) => b[criterion] - a[criterion]);

        // Calculate ranks and percentages based on the max value of the filtered set
        const maxVal = Math.max(1, ...filtered.map(e => e[criterion]));

        return filtered.map((e, idx) => ({
            ...e,
            rank: idx + 1,
            displayTimeStr: formatMinutes(e[criterion]),
            percent: (e[criterion] / maxVal) * 100
        }));
    }, [currentDate, department, criterion, searchQuery]);

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(processedData.length / itemsPerPage));
    const currentItems = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            setHoveredRow(null);
        }
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            setHoveredRow(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.filtersBar}>
                {/* Top Row of Filters */}
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <span className={styles.label}>{t('dashboard.filters.period')}:</span>
                        <div className={styles.dateNav}>
                            <div className={styles.dateInputWrapper}>
                                <input
                                    type="date"
                                    value={currentDate}
                                    onChange={(e) => { setCurrentDate(e.target.value); setCurrentPage(1); }}
                                    className={styles.dateInput}
                                />
                            </div>
                            <div className={styles.dateActions}>
                                <div className={styles.arrows}>
                                    <button onClick={handlePrevDay}><IoChevronBackOutline /></button>
                                    <button onClick={handleNextDay}><IoChevronForwardOutline /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.label}>{t('reports.workTime.table.department')}:</span>
                        <select
                            className={styles.select}
                            value={department}
                            onChange={(e) => { setDepartment(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="all">{t('dashboard.departments.all')}</option>
                            <option value="IT">IT</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.label}>{t('reports.rating.filters.criterion')}:</span>
                        <select
                            className={styles.select}
                            value={criterion}
                            onChange={(e) => { setCriterion(e.target.value as Criterion); setCurrentPage(1); }}
                        >
                            <option value="productive">{t('dashboard.cards.productive')}</option>
                            <option value="unproductive">{t('dashboard.cards.unproductive')}</option>
                            <option value="neutral">{t('dashboard.cards.neutral')}</option>
                            <option value="idle">{t('activity.timeline.legend.idle')}</option>
                        </select>
                    </div>

                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.checkmark}></span>
                        {t('dashboard.filters.onlyWorkTime')}
                    </label>

                    <button className={styles.exportBtn}>{t('dayDetails.exportXls')}</button>
                </div>

                {/* Bottom Row / Search */}
                <div className={styles.filterRow} style={{ marginTop: '16px' }}>
                    <div className={styles.searchBox}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder={t('reports.rating.searchPlaceholder')}
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </div>

            <main className={styles.main}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('reports.rating.title')}</h2>

                    <div className={styles.tableWrapper}>
                        <table className={styles.ratingTable}>
                            <thead>
                                <tr>
                                    <th className={styles.rankCol}>#</th>
                                    <th className={styles.employeeCol}>{t('reports.rating.table.fullName')}</th>
                                    <th className={styles.hostCol}>Hostname</th>
                                    <th className={styles.barCol}>{criterionLabels[criterion]}</th>
                                    <th className={styles.timeCol}>{t('reports.rating.table.time')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        onMouseEnter={() => setHoveredRow(employee.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        className={classNames(styles.tableRow, { [styles.hovered]: hoveredRow === employee.id })}
                                    >
                                        <td className={styles.rankCol}>{employee.rank}</td>
                                        <td className={styles.employeeCol}>
                                            <div className={styles.employeeInfo}>
                                                <div className={styles.avatar}>{employee.initials}</div>
                                                <div className={styles.name}>{employee.name}</div>
                                            </div>
                                        </td>
                                        <td className={styles.hostCol}>{employee.hostname}</td>
                                        <td className={styles.barCol}>
                                            <div className={styles.progressTrack}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{
                                                        width: `${employee.percent}%`,
                                                        backgroundColor: criterionColors[criterion]
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className={styles.timeCol}>{employee.displayTimeStr}</td>

                                        {/* Hover Popup */}
                                        {hoveredRow === employee.id && (
                                            <td className={styles.popupCell}>
                                                <div className={styles.hoverPopup}>
                                                    <div className={styles.popupHeader}>
                                                        <div className={styles.popupAvatar}>{employee.initials}</div>
                                                        <div className={styles.popupInfo}>
                                                            <div className={styles.popupName}>{employee.name}</div>
                                                            <div className={styles.popupHost}>{employee.hostname}</div>
                                                        </div>
                                                    </div>
                                                    <button className={styles.detailsBtn} onClick={handleOpenDetails}>
                                                        {t('reports.rating.openDetails')}
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#8a91b4' }}>
                                            {t('reports.rating.noDataFilter')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className={styles.pagination}>
                        <div className={styles.pageInfo}>
                            {t('reports.rating.showEntries')}:
                            <select
                                className={styles.perPageSelect}
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className={styles.pageControls}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange('prev')}
                                disabled={currentPage === 1}
                                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <IoChevronBackOutline />
                            </button>
                            <span className={styles.pageCurrent}>{currentPage}</span>
                            <span className={styles.pageTotal}>{t('reports.rating.of')} {totalPages}</span>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange('next')}
                                disabled={currentPage === totalPages}
                                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                <IoChevronForwardOutline />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
