import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import styles from './DayDetailsPage.module.scss';
import { DayDetailsChart } from './components/DayDetailsChart/DayDetailsChart';
import type { DayActivityData } from './components/DayDetailsChart/DayDetailsChart';

const mockData1: DayActivityData = {
    employeeName: 'Сауле Абдыкадырова Sakewa',
    date: '2026-02-18',
    department: 'Парсеры',
    donutSegments: [
        { type: 'neutral', percent: 94.6, duration: '01:03:14' },
        { type: 'idle', percent: 3.9, duration: '00:02:38' },
        { type: 'uncategorized', percent: 1.4, duration: '00:00:54' },
    ],
    timelineSegments: [
        { id: '1', type: 'neutral', startPercent: 70, widthPercent: 1.5, tooltipTime: '16:00-16:05' },
        { id: '2', type: 'neutral', startPercent: 71, widthPercent: 2, tooltipTime: '16:05-16:15' },
        { id: '3', type: 'idle', startPercent: 73, widthPercent: 0.5, tooltipTime: '16:20-16:22' },
        { id: '4', type: 'neutral', startPercent: 76, widthPercent: 1, tooltipTime: '16:45-16:50' },
        { id: '5', type: 'neutral', startPercent: 78, widthPercent: 3, tooltipTime: '16:55-17:07' },
    ],
    stats: {
        idle: '01:03:14',
        active: '00:03:38',
        productive: '00:00:05',
        unproductive: '-',
        neutral: '00:02:38',
        uncategorized: '00:00:54',
        firstActivity: '16:52:00',
        lastActivity: '17:07:00',
        timeAtWork: '00:15:00',
    }
};

const mockData2: DayActivityData = {
    employeeName: 'Сауле Абдыкадырова Sakewa',
    date: '2026-02-19',
    department: 'Парсеры',
    donutSegments: [
        { type: 'idle', percent: 58.8, duration: '03:13:30' },
        { type: 'productive', percent: 12.6, duration: '00:41:30' },
        { type: 'uncategorized', percent: 11.3, duration: '00:37:07' },
        { type: 'neutral', percent: 17.3, duration: '00:56:57' },
    ],
    timelineSegments: [
        { id: '10', type: 'neutral', startPercent: 40, widthPercent: 1, tooltipTime: '12:30' },
        { id: '11', type: 'productive', startPercent: 55, widthPercent: 2, tooltipTime: '14:00' },
        { id: '12', type: 'uncategorized', startPercent: 58, widthPercent: 1.5, tooltipTime: '14:20' },
        { id: '13', type: 'neutral', startPercent: 65, widthPercent: 4, tooltipTime: '15:15' },
        { id: '14', type: 'idle', startPercent: 70, widthPercent: 10, tooltipTime: '16:00' },
        { id: '15', type: 'productive', startPercent: 82, widthPercent: 3, tooltipTime: '17:30' },
        { id: '16', type: 'idle', startPercent: 86, widthPercent: 2, tooltipTime: '18:00' },
    ],
    stats: {
        idle: '03:13:30',
        active: '02:15:37',
        productive: '00:41:30',
        unproductive: '00:00:01',
        neutral: '00:56:57',
        uncategorized: '00:37:07',
        firstActivity: '12:30:00',
        lastActivity: '17:59:00',
        timeAtWork: '05:29:00',
    }
};

// mockDataWeek / mockDataMonth placeholders
const mockDataWeek: DayActivityData[] = [
    {
        ...mockData1,
        date: 'Неделя 1',
        stats: { ...mockData1.stats, timeAtWork: '40:15:00' }
    },
    {
        ...mockData2,
        employeeName: 'Иванов Иван',
        department: 'IT',
        date: 'Неделя 1',
        stats: { ...mockData2.stats, timeAtWork: '38:29:00' }
    },
    {
        ...mockData1,
        employeeName: 'Смирнова Анна',
        department: 'HR',
        date: 'Неделя 1',
        stats: { ...mockData1.stats, timeAtWork: '42:10:00' }
    }
];

const mockDataMonth: DayActivityData[] = [
    {
        ...mockData1,
        date: 'Февраль',
        stats: { ...mockData1.stats, timeAtWork: '160:15:00' }
    },
    {
        ...mockData2,
        employeeName: 'Петров Петр',
        department: 'Marketing',
        date: 'Февраль',
        stats: { ...mockData2.stats, timeAtWork: '155:29:00' }
    }
];

import { useLocation } from 'react-router-dom';
import { BASE_EMPLOYEES } from '@/shared/api/mock/employees.mock';

export const DayDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const passedEmployee = location.state?.selectedEmployee;

    const [isGenerated, setIsGenerated] = useState(!!passedEmployee);
    const [period, setPeriod] = useState('Day');
    
    // Map the passed employee name to the options. It handles partial name matching used in mock dropdown.
    const getInitialEmployee = () => {
        if (!passedEmployee) return 'All';
        const found = BASE_EMPLOYEES.find(e => e.name === passedEmployee);
        return found ? found.name : 'All';
    };
    const [selectedEmployee, setSelectedEmployee] = useState(getInitialEmployee());
    const [currentDate, setCurrentDate] = useState('2026-02-21');

    // Pagination state
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handleGenerate = () => {
        setIsGenerated(true);
    };

    const handlePrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        setCurrentDate(date.toISOString().split('T')[0]);
        setCurrentPage(1);
    };

    const handleNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        setCurrentDate(date.toISOString().split('T')[0]);
        setCurrentPage(1);
    };

    const renderCharts = () => {
        let activeData: DayActivityData[] = [];
        if (period === 'Day') {
            activeData = [
                mockData1,
                mockData2,
                { ...mockData1, employeeName: 'Иванов Иван', department: 'IT' },
                { ...mockData2, employeeName: 'Смирнова Анна', department: 'HR' }
            ];
        }
        if (period === 'Week') activeData = mockDataWeek;
        if (period === 'Month') activeData = mockDataMonth;

        if (selectedEmployee !== 'All') {
            activeData = activeData.filter(d => d.employeeName === selectedEmployee);
            
            // If the filtered array is empty (meaning we don't have hardcoded mock data for this specific new employee)
            // We'll generate a dummy set based on mockData1 so the chart isn't empty and the filtering still "works" visually.
            if (activeData.length === 0) {
                activeData = [
                    { ...mockData1, employeeName: selectedEmployee, department: BASE_EMPLOYEES.find(e => e.name === selectedEmployee)?.department || 'IT' },
                    { ...mockData2, employeeName: selectedEmployee, department: BASE_EMPLOYEES.find(e => e.name === selectedEmployee)?.department || 'IT' }
                ];
            }
        }

        // Generate repeated data to demonstrate pagination when there are few real mock items
        let fullData = [...activeData];
        if (fullData.length > 0 && fullData.length < 15 && period === 'Day' && selectedEmployee === 'All') {
            for(let i=0; i<30; i++) {
                fullData.push({...fullData[i % activeData.length], employeeName: `${fullData[i % activeData.length].employeeName} (Копия ${i + 1})`});
            }
        }

        const totalPages = Math.max(1, Math.ceil(fullData.length / itemsPerPage));
        const safeCurrentPage = Math.min(currentPage, totalPages);
        const currentItems = fullData.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

        const handlePageChange = (direction: 'next' | 'prev') => {
            if (direction === 'prev' && safeCurrentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
            if (direction === 'next' && safeCurrentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
            }
        };

        return (
            <>
                <div className={styles.generatedContent}>
                    {currentItems.map((data, idx) => (
                        <DayDetailsChart key={idx} data={{ ...data, date: period === 'Day' ? new Date(currentDate).toLocaleDateString('ru-RU') : data.date }} />
                    ))}
                    {currentItems.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8a91b4' }}>
                            {t('reports.rating.noDataFilter')}
                        </div>
                    )}
                </div>

                {fullData.length > 0 && (
                    <div className={styles.pagination}>
                        <div className={styles.pageInfo}>
                            {t('reports.rating.showEntries')}:
                            <select
                                className={styles.perPageSelect}
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className={styles.pageControls}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange('prev')}
                                disabled={safeCurrentPage === 1}
                                style={{ opacity: safeCurrentPage === 1 ? 0.5 : 1, cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <IoChevronBackOutline />
                            </button>
                            <span className={styles.pageCurrent}>{safeCurrentPage}</span>
                            <span className={styles.pageTotal}>{t('reports.rating.of')} {totalPages}</span>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange('next')}
                                disabled={safeCurrentPage === totalPages}
                                style={{ opacity: safeCurrentPage === totalPages ? 0.5 : 1, cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                <IoChevronForwardOutline />
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.filtersBar}>
                <div className={styles.filterGroup}>
                    <div className={styles.labelGroup}>
                        <span>{t('dashboard.filters.period')}:</span>
                        <select className={styles.select} value={period} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="Day">{t('dashboard.filters.periods.day')}</option>
                            <option value="Week">{t('dashboard.filters.periods.week')}</option>
                            <option value="Month">{t('dashboard.filters.periods.month')}</option>
                        </select>
                    </div>

                    <div className={styles.dateNav}>
                        <div className={styles.dateInputWrapper}>
                            <input
                                type="date"
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
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
                    <div className={styles.labelGroup}>
                        <span>{t('dashboard.filters.employee')}:</span>
                        <select className={styles.select} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                            <option value="All">{t('dashboard.departments.all')}</option>
                            {BASE_EMPLOYEES.map(emp => (
                                <option key={emp.id} value={emp.name}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.checkmark}></span>
                        {t('dashboard.filters.onlyWorkTime')}
                    </label>
                </div>

                <div className={styles.actionGroup}>
                    <button className={styles.generateBtn} onClick={handleGenerate}>
                        {t('dayDetails.generate')}
                    </button>
                    <button className={styles.exportBtn}>
                        {t('dayDetails.exportXls')}
                    </button>
                </div>
            </div>

            <main className={styles.main}>
                {!isGenerated ? (
                    <div className={styles.emptyState}>
                        <h2>{t('dayDetails.title')}</h2>
                        <div className={styles.infoBox}>
                            <span className={styles.infoIcon}>i</span>
                            <p>{t('dayDetails.emptyStateInfo')}</p>
                        </div>
                    </div>
                ) : (
                    renderCharts()
                )}
            </main>
        </div>
    );
};
